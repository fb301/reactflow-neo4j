import { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";

interface UseDeletionOperationsProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export const useDeletionOperations = ({
  nodes,
  edges,
  setNodes,
  setEdges,
}: UseDeletionOperationsProps) => {
  const deleteSelectedElements = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);

    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      const confirmDelete = window.confirm(
        `Delete ${selectedNodes.length} node(s) and ${selectedEdges.length} edge(s)?`
      );

      if (confirmDelete) {
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
  }, [nodes, edges, setNodes, setEdges]);

  const deleteNode = useCallback(
    (nodeId: string) => {
      const confirmDelete = window.confirm(
        "Delete this node and all its connections?"
      );
      if (confirmDelete) {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
        );
      }
    },
    [setNodes, setEdges]
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      const confirmDelete = window.confirm("Delete this connection?");
      if (confirmDelete) {
        setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      }
    },
    [setEdges]
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
