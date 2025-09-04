import json
from .schemas import (
    Position, Node, Relationship, FlowData, FlowDataInput
) 
from typing_extensions import LiteralString
from typing import Optional, cast
from textwrap import dedent
from database import get_driver

def query(q: LiteralString) -> LiteralString:
    return cast(LiteralString, dedent(q).strip())

class QueryResolver:
    @staticmethod
    async def restore_flow() -> FlowData:
        """Restore the saved flow data from Neo4j"""
        driver = get_driver()

        try:
            async with driver.session() as session:
                # Query to get all nodes (using a generic pattern to match any labeled node)
                nodes_query = query("""
                    MATCH (n)
                    WHERE n.flow_node_id IS NOT NULL
                    RETURN n.flow_node_id as id, n.label as label, n.x as x, n.y as y, 
                           n.type as type, labels(n)[0] as node_label
                    ORDER BY n.created_at DESC
                """)
                
                # Query to get all relationships
                relationships_query = query("""
                    MATCH (source)-[r]->(target)
                    WHERE source.flow_node_id IS NOT NULL AND target.flow_node_id IS NOT NULL
                    AND r.id IS NOT NULL
                    RETURN r.id as id, source.flow_node_id as source, target.flow_node_id as target, 
                           type(r) as type, r.label as label
                    ORDER BY r.created_at DESC
                """)
                
                # Execute queries
                nodes_result = await session.run(nodes_query)
                nodes_records = await nodes_result.data()
                
                relationships_result = await session.run(relationships_query)
                relationships_records = await relationships_result.data()
                
                # Convert to GraphQL types
                nodes = [
                    Node(
                        id=record["id"],
                        label=record["label"] or "Unlabeled",
                        position=Position(x=float(record["x"] or 0), y=float(record["y"] or 0))
                    ) for record in nodes_records
                ]
                
                relationships = [
                    Relationship(
                        id=record["id"],
                        source=record["source"],
                        target=record["target"],
                        label=record["label"]
                    ) for record in relationships_records
                ]
                
                print(f"Restored {len(nodes)} nodes and {len(relationships)} relationships from Neo4j")
                return FlowData(nodes=nodes, relationships=relationships)
                
        except Exception as e:
            print(f"Error restoring flow from Neo4j: {e}")
            # Return empty flow data on error
            return FlowData(nodes=[], relationships=[])

class MutationResolver:
    @staticmethod
    async def save_flow(flow_data: FlowDataInput) -> bool:
        """Save the flow data to Neo4j"""
        driver = get_driver()
        print(flow_data)
        try:
            async with driver.session() as session:
                async def save_transaction(tx):
                    # Clear existing flow data
                    clear_query = query("""
                        MATCH (n)
                        WHERE n.flow_node_id IS NOT NULL
                        DETACH DELETE n
                    """)
                    await tx.run(clear_query)
                    
                    # Save nodes with their label names as Neo4j labels
                    for node in flow_data.nodes:
                        # Clean the label to make it a valid Neo4j label
                        node_label = "".join(c for c in node.label if c.isalnum() or c == "_")
                        if not node_label or not node_label[0].isalpha():
                            node_label = "Node_" + node_label
                        
                        # Create node with dynamic label
                        node_query = f"""
                            CREATE (n:`{node_label}` {{
                                flow_node_id: $id,
                                label: $label,
                                x: $x,
                                y: $y,
                                created_at: datetime()
                            }})
                        """
                        await tx.run(node_query, {
                            "id": node.id,
                            "label": node.label,
                            "x": node.position.x,
                            "y": node.position.y
                        })
                    
                    # Save relationships
                    for rel in flow_data.relationships:
                        # Clean the label to make it a valid Neo4j relationship type
                        rel_type = "".join(c for c in (rel.label or "CONNECTS_TO") if c.isalnum() or c == "_").upper()
                        if not rel_type or not rel_type[0].isalpha():
                            rel_type = "CONNECTS_TO"
                        
                        rel_query = f"""
                            MATCH (source) WHERE source.flow_node_id = $source_id
                            MATCH (target) WHERE target.flow_node_id = $target_id
                            CREATE (source)-[r:`{rel_type}` {{
                                id: $id,
                                label: $label,
                                created_at: datetime()
                            }}]->(target)
                        """
                        await tx.run(rel_query, {
                            "source_id": rel.source,
                            "target_id": rel.target,
                            "id": rel.id,
                            "label": rel.label
                        })
                
                # Execute the transaction
                await session.execute_write(save_transaction)
                
                print(f"Saved {len(flow_data.nodes)} nodes and {len(flow_data.relationships)} relationships to Neo4j")
                return True
                
        except Exception as e:
            print(f"Error saving flow to Neo4j: {e}")
            return False