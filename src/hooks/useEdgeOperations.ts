import { useCallback } from "react";
import { addEdge } from "@xyflow/react";

interface UseEdgeOperationsProps {
  setEdges: (updater: (edges: any[]) => any[]) => void;
}

export const useEdgeOperations = ({ setEdges }: UseEdgeOperationsProps) => {
  const onConnect = useCallback(
    (params: any) => {
      // Debug: Log all connection parameters from ReactFlow
      console.log("ReactFlow onConnect params:", {
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        sourceX: params.sourceX,
        sourceY: params.sourceY,
        targetX: params.targetX,
        targetY: params.targetY,
        sourcePosition: params.sourcePosition,
        targetPosition: params.targetPosition,
      });

      const label = prompt("Enter a label for this relation:", "connected");

      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        type: "custom-labeled",
        markerEnd: {
          type: "arrowclosed",
        },
        data: { label: label || "connected" },
      };

      console.log(
        `Creating edge: ${params.source} → ${params.target} (${label})`
      );
      console.log("Complete edge object:", newEdge);

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onEdgeDoubleClick = useCallback(
    (event: any, edge: any) => {
      event.stopPropagation();
      const currentEdgeLabel = edge.data?.label || edge.label || "";
      const newLabel = prompt("Edit edge label:", currentEdgeLabel);

      if (newLabel !== null) {
        setEdges((edges) =>
          edges.map((e) =>
            e.id === edge.id
              ? {
                  ...e,
                  type: "custom-labeled",
                  data: { ...e.data, label: newLabel },
                }
              : e
          )
        );
      }
    },
    [setEdges]
  );

  return {
    onConnect,
    onEdgeDoubleClick,
  };
};
