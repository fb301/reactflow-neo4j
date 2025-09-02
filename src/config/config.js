class Config {
  constructor() {
    this.APP_NAME = import.meta.env.VITE_APP_NAME || "ReactFlow Neo4j";
    this.GRAPHQL_URL =
      import.meta.env.VITE_GRAPHQL_URL || "http://127.0.0.1:8000/graphql";
  }
}

export const config = new Config();
