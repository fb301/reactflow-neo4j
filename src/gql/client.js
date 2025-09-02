import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { config } from "../config/config";

const httpLink = new HttpLink({
  uri: config.GRAPHQL_URL,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
