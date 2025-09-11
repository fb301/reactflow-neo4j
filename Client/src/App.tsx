import { ReactFlowProvider } from "@xyflow/react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./gql/client.js";
import { Canvas } from "./components/canvas";
import { initialNodes, initialEdges } from "./data/initialFlowData";
import { Prompt, usePrompt } from "./components/ui/";

import "./custom-reactflow.css";

const App = () => {
  const { showPrompt, promptProps } = usePrompt();

  return (
    <ApolloProvider client={client}>
      <ReactFlowProvider>
        <Canvas
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          showPrompt={showPrompt}
        />
        <Prompt {...promptProps} />
      </ReactFlowProvider>
    </ApolloProvider>
  );
};

export default App;
