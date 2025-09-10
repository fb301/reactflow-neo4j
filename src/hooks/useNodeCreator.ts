import { useCallback } from "react";
import { getNodeId } from "../data/idGenerator";

interface UseNodeCreatorProps {
  setNodes: (updater: (nodes: any[]) => any[]) => void;
}

export const useNodeCreator = ({ setNodes }: UseNodeCreatorProps) => {
  const createNode = useCallback(() => {
    const nodeType =
      prompt("Node type (e.g., Actor, Movie, Director):") || "Node";
    const attributeName = prompt("First attribute name:") || "Name";
    const attributeValue = prompt("First attribute value:") || "New Value";

    const newNode = {
      id: getNodeId(),
      type: "dynamic",
      data: {
        nodeType: nodeType,
        attributes: { [attributeName]: attributeValue },
      },
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return { createNode };
};
