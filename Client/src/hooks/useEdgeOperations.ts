import { useCallback } from "react";
import { addEdge } from "@xyflow/react";
import { getNodeId } from "../data/idGenerator";

interface UseEdgeOperationsProps {
  setEdges: (updater: (edges: any[]) => any[]) => void;
  showPrompt: (options: {
    title: string;
    defaultValue?: string;
  }) => Promise<string | null>;
}

export const useEdgeOperations = ({
  setEdges,
  showPrompt,
}: UseEdgeOperationsProps) => {
  const onConnect = useCallback(
    async (params: any) => {
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

      const label =
        (await showPrompt({
          title: "Enter a label for this relation:",
          defaultValue: "connected",
        })) || "connected";

      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${getNodeId()}`,
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
    [setEdges, showPrompt]
  );

  const onEdgeDoubleClick = useCallback(
    async (event: any, edge: any) => {
      event.stopPropagation();
      const currentEdgeLabel = edge.data?.label || edge.label || "";
      const newLabel = await showPrompt({
        title: "Edit edge label:",
        defaultValue: currentEdgeLabel,
      });

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
    [setEdges, showPrompt]
  );

  return {
    onConnect,
    onEdgeDoubleClick,
  };
};
