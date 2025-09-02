import strawberry
from strawberry.asgi import GraphQL

from .resolvers import QueryResolver, MutationResolver, FlowData, FlowDataInput


@strawberry.type
class Query:
    @strawberry.field
    def restore_flow(self) -> FlowData:
        return QueryResolver.restore_flow()

@strawberry.type 
class Mutation:
    @strawberry.field
    def save_flow(self, flow_data: FlowDataInput) -> bool:
        return MutationResolver.save_flow(flow_data)

    
schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQL(schema)