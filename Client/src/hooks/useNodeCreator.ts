import { useCallback } from "react";
import { getNodeId } from "../data/idGenerator";

interface UseNodeCreatorProps {
  setNodes: (updater: (nodes: any[]) => any[]) => void;
  showPrompt: (options: {
    title: string;
    defaultValue?: string;
  }) => Promise<string | null>;
}

export const useNodeCreator = ({
  setNodes,
  showPrompt,
}: UseNodeCreatorProps) => {
  const createNode = useCallback(async () => {
    const nodeType =
      (await showPrompt({
        title: "Node type (e.g., Actor, Movie, Director):",
      })) || "Node";
    const attributeName =
      (await showPrompt({ title: "First attribute name:" })) || "Name";
    const attributeValue =
      (await showPrompt({ title: "First attribute value:" })) || "New Value";

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
  }, [setNodes, showPrompt]);

  return { createNode };
};
