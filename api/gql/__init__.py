import strawberry
from strawberry.asgi import GraphQL

from .resolvers import QueryResolver, MutationResolver
from .schemas import FlowData, FlowDataInput


@strawberry.type
class Query:
    @strawberry.field
    async def restore_flow(self) -> FlowData:
        return await QueryResolver.restore_flow()

@strawberry.type 
class Mutation:
    @strawberry.field
    async def save_flow(self, flow_data: FlowDataInput) -> bool:
        return await MutationResolver.save_flow(flow_data)

    
schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQL(schema)