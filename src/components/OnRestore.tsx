import React, { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import { client } from "../gql/client.js";
import { gql } from "@apollo/client";

const RESTORE_FLOW = gql`
  query RestoreFlow {
    restoreFlow {
      nodes {
        id
        nodeType
        attributes
        x
        y
      }
      relationships {
        id
        source
        target
        label
      }
    }
  }
`;

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
        const mappedNodes: Node[] =
          data.nodes?.map((node) => ({
            id: node.id,
            type: "dynamic",
            data: {
              nodeType: node.nodeType,
              attributes: node.attributes,
            },
            position: { x: node.x, y: node.y },
          })) || [];

        const mappedEdges: Edge[] =
          data.relationships?.map((rel) => ({
            id: rel.id,
            source: rel.source,
            target: rel.target,
            type: "custom-labeled",
            data: { label: rel.label || "connects to" },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#b1b1b7",
            },
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
