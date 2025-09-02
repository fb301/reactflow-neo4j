import strawberry
from typing import List, Optional

@strawberry.type
class NodeData:
    label: str

@strawberry.type 
class Position:
    x: float
    y: float

@strawberry.type
class Viewport:
    x: float
    y: float
    zoom: float

@strawberry.type
class Node:
    id: str
    data: NodeData
    position: Position
    type: str

@strawberry.type
class RelationshipData:
    label: Optional[str] = None

@strawberry.type
class Relationship:
    id: str
    source: str
    target: str
    type: str
    data: Optional[RelationshipData] = None

@strawberry.type
class FlowData:
    nodes: List[Node]
    relationships: List[Relationship]
    viewport: Optional[Viewport] = None


""" INPUT """
@strawberry.input
class NodeDataInput:
    label: str

@strawberry.input
class PositionInput:
    x: float
    y: float

@strawberry.input
class ViewportInput:
    x: float
    y: float
    zoom: float

@strawberry.input
class NodeInput:
    id: str
    data: NodeDataInput
    position: PositionInput
    type: str

@strawberry.input
class RelationshipDataInput:
    label: Optional[str] = None

@strawberry.input
class RelationshipInput:
    id: str
    source: str
    target: str
    type: str
    data: Optional[RelationshipDataInput] = None

@strawberry.input
class FlowDataInput:
    nodes: List[NodeInput]
    relationships: List[RelationshipInput]
    viewport: Optional[ViewportInput] = None