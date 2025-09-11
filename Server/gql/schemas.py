import strawberry
from typing import List, Optional


# Output
@strawberry.type
class Node:
    id: str
    nodeType: str
    attributes: strawberry.scalars.JSON
    x: float
    y: float


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


# Input
@strawberry.input
class NodeInput:
    id: str
    nodeType: str
    attributes: strawberry.scalars.JSON
    x: float
    y: float


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
