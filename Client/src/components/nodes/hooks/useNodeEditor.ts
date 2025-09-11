import { useState, useCallback, useEffect } from "react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { NodeData } from "../types";

export const useNodeEditor = (initialData: NodeData, nodeId: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(nodeId);
  }, [isEditing, nodeId, updateNodeInternals]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const saveNode = useCallback(
    (editedData: NodeData) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: editedData as unknown as Record<string, unknown>,
              }
            : node
        )
      );
      setIsEditing(false);
      setTimeout(() => updateNodeInternals(nodeId), 0);
    },
    [nodeId, setNodes, updateNodeInternals]
  );

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setTimeout(() => updateNodeInternals(nodeId), 0);
  }, [nodeId, updateNodeInternals]);

  return {
    isEditing,
    startEditing,
    saveNode,
    cancelEdit,
  };
};
