import React, { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import { client } from "../gql/client.js";
import { RESTORE_FLOW } from "../gql/queries.js";

interface OnRestoreProps {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const OnRestore: React.FC<OnRestoreProps> = ({ setNodes, setEdges }) => {
  const onRestore = useCallback(async () => {
    try {
      type RestoreFlowResult = {
        restoreFlow?: {
          nodes?: any[];
          relationships?: any[];
        };
      };

      const result = await client.query<RestoreFlowResult>({
        query: RESTORE_FLOW,
        fetchPolicy: "network-only",
      });

      const data = result.data?.restoreFlow;
      if (data) {
        // Map GraphQL nodes to ReactFlow format
        const mappedNodes: Node[] =
          data.nodes?.map((node) => ({
            id: node.id,
            data: { label: node.label },
            position: node.position,
            type: "default",
          })) || [];

        // Map GraphQL relationships to ReactFlow edges format
        const mappedEdges: Edge[] =
          data.relationships?.map((rel) => ({
            id: rel.id,
            source: rel.source,
            target: rel.target,
            type: "custom-labeled",
            data: { label: rel.label || "connects to" },
          })) || [];

        setNodes(mappedNodes);
        setEdges(mappedEdges);
      }
      console.log("Data restored success");
    } catch (error) {
      console.log("Error restoring flow:", error);
    }
  }, [setNodes, setEdges]);

  return (
    <button className="xy-theme__button" onClick={onRestore}>
      restore
    </button>
  );
};

export default OnRestore;
