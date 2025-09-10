import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./gql/client.js";
import Canvas from "./components/canvas/Canvas";
import { initialNodes, initialEdges } from "./data/initialFlowData";
import "@xyflow/react/dist/style.css";

const App = () => (
  <ApolloProvider client={client}>
    <ReactFlowProvider>
      <Canvas initialNodes={initialNodes} initialEdges={initialEdges} />
    </ReactFlowProvider>
  </ApolloProvider>
);

export default App;
