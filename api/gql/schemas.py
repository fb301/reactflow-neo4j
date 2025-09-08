import strawberry
from typing import List, Optional

# Simplified output types
@strawberry.type 
class Position:
    x: float
    y: float

@strawberry.type
class Node:
    id: str
    label: str
    position: Position

@strawberry.type
class Relationship:
    id: str
    source: str
    target: str
    label: Optional[str] = None

@strawberry.type
class FlowData:
    nodes: List[Node]
    relationships: List[Relationship]

# Input types
@strawberry.input
class PositionInput:
    x: float
    y: float

@strawberry.input
class NodeInput:
    id: str
    label: str
    position: PositionInput

@strawberry.input
class RelationshipInput:
    id: str
    label: str
    source: str
    target: str

@strawberry.input
class FlowDataInput:
    nodes: List[NodeInput]
    relationships: List[RelationshipInput]