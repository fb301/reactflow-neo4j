from typing_extensions import LiteralString
from typing import cast
from textwrap import dedent
from database import get_driver
from .schemas import Node, Relationship, FlowData, FlowDataInput


def query(q: LiteralString) -> LiteralString:
    return cast(LiteralString, dedent(q).strip())


async def restore_flow() -> FlowData:
    driver = get_driver()
    try:
        async with driver.session() as session:
            nodes_result = await session.run(query("""
                MATCH (n) 
                WHERE n.flow_node_id IS NOT NULL
                RETURN n.flow_node_id as id, n.node_type as node_type, 
                       n.x as x, n.y as y, properties(n) as props
            """))
            nodes_data = await nodes_result.data()
            
            rels_result = await session.run(query("""
                MATCH (source)-[r]->(target)
                WHERE source.flow_node_id IS NOT NULL 
                AND target.flow_node_id IS NOT NULL
                AND r.id IS NOT NULL
                RETURN r.id as id, source.flow_node_id as source, 
                       target.flow_node_id as target, r.label as label
            """))
            rels_data = await rels_result.data()
            
            nodes = []
            for n in nodes_data:
                attrs = {k: v for k, v in n["props"].items() 
                        if k not in ["flow_node_id", "node_type", "x", "y"]}
                
                nodes.append(Node(
                    id=n["id"], 
                    nodeType=n["node_type"] or "Node",
                    attributes=attrs,
                    x=n["x"], 
                    y=n["y"]
                ))
            
            relationships = [
                Relationship(
                    id=r["id"], 
                    source=r["source"], 
                    target=r["target"], 
                    label=r["label"]
                ) for r in rels_data
            ]
            
            return FlowData(nodes=nodes, relationships=relationships)
            
    except Exception as e:
        print(f"Error restoring flow: {e}")
        return FlowData(nodes=[], relationships=[])


async def save_flow(flow_data: FlowDataInput) -> bool:
    driver = get_driver()
    try:
        print(f"Save flow called with {len(flow_data.nodes)} nodes")
        async with driver.session() as session:
            await session.run(query("""
                MATCH (n) 
                WHERE n.flow_node_id IS NOT NULL 
                DETACH DELETE n
            """))
            
            # Create nodes
            if flow_data.nodes:
                for node in flow_data.nodes:
                    node_label = "".join(c for c in node.nodeType if c.isalnum() or c == "_")
                    if not node_label or not node_label[0].isalpha():
                        node_label = "Node_" + node_label
                    
                    node_props = {
                        "flow_node_id": node.id,
                        "node_type": node.nodeType,
                        "x": node.x,
                        "y": node.y
                    }

                    if node.attributes:
                        node_props.update(node.attributes)
                    
                    print(f"Creating node: label={node_label}, props={node_props}")
                    await session.run(
                        query("CALL apoc.create.nodes([$label], [$props])"),
                        {"label": node_label, "props": node_props}
                    )
            
            # Create relationships
            if flow_data.relationships:
                rel_data = []
                for rel in flow_data.relationships:
                    rel_type = rel.label.replace(" ", "_").upper() if rel.label else "CONNECTS_TO"
                    rel_data.append({
                        "source": rel.source,
                        "target": rel.target,
                        "type": rel_type,
                        "properties": {
                            "id": rel.id,
                            "label": rel.label
                        }
                    })
                
                print(f"Creating relationships: {rel_data}")
                
                await session.run(query("""
                    UNWIND $rel_data AS rel
                    MATCH (source {flow_node_id: rel.source})
                    MATCH (target {flow_node_id: rel.target})
                    WITH source, target, rel
                    CALL apoc.create.relationship(source, rel.type, rel.properties, target)
                    YIELD rel as created_rel
                    RETURN source.flow_node_id as source_id, target.flow_node_id as target_id, rel.type as rel_type
                """), {"rel_data": rel_data})
            
            return True
    except Exception as e:
        print(f"Error saving flow: {e}")
        return False
