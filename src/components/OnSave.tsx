import React, { useCallback } from "react";
import { ReactFlowInstance } from "@xyflow/react";
import { client } from "../gql/client.js";
import { gql } from "@apollo/client";

const SAVE_FLOW = gql`
  mutation SaveFlow($flowData: FlowDataInput!) {
    saveFlow(flowData: $flowData)
  }
`;

interface OnSaveProps {
  rfInstance: ReactFlowInstance | null;
}

const OnSave: React.FC<OnSaveProps> = ({ rfInstance }) => {
  const onSave = useCallback(async () => {
    console.log("OnSave clicked");
    if (rfInstance) {
      try {
        const flow = rfInstance.toObject();
        console.log("Flow object:", flow);

        const graphqlData = {
          nodes: flow.nodes.map((node) => ({
            id: node.id,
            nodeType: node.data.nodeType || "Node",
            attributes: node.data.attributes || {},
            x: node.position.x,
            y: node.position.y,
          })),
          relationships: flow.edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.data?.label,
          })),
        };

        await client.mutate({
          mutation: SAVE_FLOW,
          variables: { flowData: graphqlData },
        });
        console.log("Data save success");
      } catch (error) {
        console.log("Error: ", error);
      }
    } else {
      console.log("No rfInstance available");
    }
  }, [rfInstance]);

  return (
    <button className="xy-theme__button" onClick={onSave}>
      save
    </button>
  );
};

export default OnSave;
