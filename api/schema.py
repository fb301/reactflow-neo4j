import typing
import strawberry

@strawberry.type
class Nodes:
    UUID: str
    label: str
    measured: "Measured"
    position: "Position"

@strawberry.type
class Measured:
    height: int
    width: int

@strawberry.type
class Position:
    x: int
    y: int

@strawberry.type
class Relationships:
    id: str
    label: str
    source: str
    target: str