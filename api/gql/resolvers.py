import json
from .schemas import (
    NodeData, Position, Viewport, Node, RelationshipData, Relationship, FlowData,
    FlowDataInput
) 

flow_storage = {
    "nodes": [],
    "relationships": [],
    "viewport": {"x": 0, "y": 0, "zoom": 1}
}

class QueryResolver:
    @staticmethod
    def restore_flow() -> FlowData:
        """Restore the saved flow data"""
        try:
            nodes = [
                Node(
                    id=node["id"],
                    data=NodeData(label=node["data"]["label"]),
                    position=Position(x=node["position"]["x"], y=node["position"]["y"]),
                    type=node["type"]
                ) for node in flow_storage["nodes"]
            ]
            
            relationships = [
                Relationship(
                    id=rel["id"],
                    source=rel["source"],
                    target=rel["target"],
                    type=rel["type"],
                    data=RelationshipData(label=rel["data"]["label"]) if rel.get("data") and rel["data"].get("label") else None
                ) for rel in flow_storage["relationships"]
            ]
            
            viewport = None
            if flow_storage.get("viewport"):
                vp = flow_storage["viewport"]
                viewport = Viewport(x=vp["x"], y=vp["y"], zoom=vp["zoom"])
            
            print(f"Restoring {len(nodes)} nodes and {len(relationships)} relationships")
            return FlowData(nodes=nodes, relationships=relationships, viewport=viewport)
            
        except Exception as e:
            print(f"Error restoring flow: {e}")
            return FlowData(nodes=[], relationships=[], viewport=None)

class MutationResolver:
    @staticmethod
    def save_flow(flow_data: FlowDataInput) -> bool:
        """Save the flow data"""
        try:
            nodes_data = []
            for node in flow_data.nodes:
                nodes_data.append({
                    "id": node.id,
                    "data": {"label": node.data.label},
                    "position": {"x": node.position.x, "y": node.position.y},
                    "type": node.type
                })
            
            relationships_data = []
            for rel in flow_data.relationships:
                rel_dict = {
                    "id": rel.id,
                    "source": rel.source,
                    "target": rel.target,
                    "type": rel.type,
                    "data": {"label": rel.data.label} if rel.data and rel.data.label else None
                }
                relationships_data.append(rel_dict)
            
            viewport_data = {"x": 0, "y": 0, "zoom": 1}
            if flow_data.viewport:
                viewport_data = {
                    "x": flow_data.viewport.x,
                    "y": flow_data.viewport.y,
                    "zoom": flow_data.viewport.zoom
                }
            
            flow_storage["nodes"] = nodes_data
            flow_storage["relationships"] = relationships_data
            flow_storage["viewport"] = viewport_data
            
            print(f"Saved {len(nodes_data)} nodes and {len(relationships_data)} relationships")
            print(f"Flow data: {json.dumps(flow_storage, indent=2)}")
            
            return True
            
        except Exception as e:
            print(f"Error saving flow: {e}")
            return False
