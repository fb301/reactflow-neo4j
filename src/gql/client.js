import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { config } from "../config/config";

export const client = new ApolloClient({
  link: new HttpLink({ uri: config.GRAPHQL_URL }),
  cache: new InMemoryCache(),
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
