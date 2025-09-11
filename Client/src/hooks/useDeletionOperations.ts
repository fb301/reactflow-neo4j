import { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";

interface UseDeletionOperationsProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  showPrompt: (options: {
    title: string;
    defaultValue?: string;
  }) => Promise<string | null>;
}

export const useDeletionOperations = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  showPrompt,
}: UseDeletionOperationsProps) => {
  const deleteSelectedElements = useCallback(async () => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);

    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      const confirmDelete = await showPrompt({
        title: `Delete ${selectedNodes.length} node(s) and ${selectedEdges.length} edge(s)? Type "yes" to confirm:`,
        defaultValue: "",
      });

      if (confirmDelete === "yes") {
        // Delete selected nodes (this will also delete connected edges automatically)
        if (selectedNodes.length > 0) {
          setNodes((nds) => nds.filter((node) => !node.selected));
        }

        // Delete selected edges
        if (selectedEdges.length > 0) {
          setEdges((eds) => eds.filter((edge) => !edge.selected));
        }
      }
    }
  }, [nodes, edges, setNodes, setEdges, showPrompt]);

  const deleteNode = useCallback(
    async (nodeId: string) => {
      const confirmDelete = await showPrompt({
        title:
          'Delete this node and all its connections? Type "yes" to confirm:',
        defaultValue: "",
      });
      if (confirmDelete === "yes") {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
        );
      }
    },
    [setNodes, setEdges, showPrompt]
  );

  const deleteEdge = useCallback(
    async (edgeId: string) => {
      const confirmDelete = await showPrompt({
        title: 'Delete this connection? Type "yes" to confirm:',
        defaultValue: "",
      });
      if (confirmDelete === "yes") {
        setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      }
    },
    [setEdges, showPrompt]
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      deleteNode(node.id);
    },
    [deleteNode]
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      deleteEdge(edge.id);
    },
    [deleteEdge]
  );

  return {
    deleteSelectedElements,
    deleteNode,
    deleteEdge,
    onNodeContextMenu,
    onEdgeContextMenu,
  };
};
