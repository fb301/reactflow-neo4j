import React, { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import { client } from "../../gql/client.js";
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

interface RestoreButtonProps {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const RestoreButton: React.FC<RestoreButtonProps> = ({
  setNodes,
  setEdges,
}) => {
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

        // Handle distribution logic
        const sourceHandles = [
          "top-source",
          "right-source",
          "bottom-source",
          "left-source",
        ];
        const targetHandles = [
          "top-target",
          "right-target",
          "bottom-target",
          "left-target",
        ];

        // Track handle usage for each node
        const nodeSourceHandleIndex: Record<string, number> = {};
        const nodeTargetHandleIndex: Record<string, number> = {};

        const mappedEdges: Edge[] =
          data.relationships?.map((rel) => {
            // Get next available source handle for source node
            if (!(rel.source in nodeSourceHandleIndex)) {
              nodeSourceHandleIndex[rel.source] = 0;
            }
            const sourceHandle =
              sourceHandles[
                nodeSourceHandleIndex[rel.source] % sourceHandles.length
              ];
            nodeSourceHandleIndex[rel.source]++;

            // Get next available target handle for target node
            if (!(rel.target in nodeTargetHandleIndex)) {
              nodeTargetHandleIndex[rel.target] = 0;
            }
            const targetHandle =
              targetHandles[
                nodeTargetHandleIndex[rel.target] % targetHandles.length
              ];
            nodeTargetHandleIndex[rel.target]++;

            return {
              id: rel.id,
              source: rel.source,
              target: rel.target,
              sourceHandle: sourceHandle,
              targetHandle: targetHandle,
              type: "custom-labeled",
              data: { label: rel.label || "connects to" },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: "#b1b1b7",
              },
            };
          }) || [];

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

export default RestoreButton;
