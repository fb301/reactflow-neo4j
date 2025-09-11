import strawberry
from strawberry.asgi import GraphQL

from .schemas import FlowData, FlowDataInput
from .resolvers import restore_flow, save_flow


@strawberry.type
class Query:
    @strawberry.field
    async def restore_flow(self) -> FlowData:
        return await restore_flow()


@strawberry.type 
class Mutation:
    @strawberry.mutation
    async def save_flow(self, flow_data: FlowDataInput) -> bool:
        return await save_flow(flow_data)


schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQL(schema)