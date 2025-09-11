import React, { useState } from "react";
import {
  Background,
  ReactFlow,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MiniMap,
  Panel,
} from "@xyflow/react";
import { CustomNode } from "../nodes";
import CustomLabeledEdge from "../edges/CustomLabeledEdge";
import FlowPanel from "../panel/FlowPanel";
import { useDeletionOperations } from "../../hooks/useDeletionOperations";
import { useDeleteKeyboard } from "../../hooks/useDeleteKeyboard";
import { useNodeCreator } from "../../hooks/useNodeCreator";
import { useEdgeOperations } from "../../hooks/useEdgeOperations";

interface CanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

const nodeTypes = {
  dynamic: CustomNode,
};

const edgeTypes = {
  "custom-labeled": CustomLabeledEdge,
};

const Canvas: React.FC<CanvasProps> = ({ initialNodes, initialEdges }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Hooks
  const { createNode } = useNodeCreator({ setNodes });
  const { onConnect, onEdgeDoubleClick } = useEdgeOperations({ setEdges });
  const { deleteSelectedElements, onNodeContextMenu, onEdgeContextMenu } =
    useDeletionOperations({
      nodes,
      edges,
      setNodes,
      setEdges,
    });

  useDeleteKeyboard({ deleteSelectedElements });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={(instance) => setRfInstance(instance as any)}
      onConnect={onConnect}
      onEdgeDoubleClick={onEdgeDoubleClick}
      onNodeContextMenu={onNodeContextMenu}
      onEdgeContextMenu={onEdgeContextMenu}
      deleteKeyCode={["Delete", "Backspace"]}
      fitView
      fitViewOptions={{ padding: 2 }}
    >
      <Background />
      <FlowPanel
        rfInstance={rfInstance}
        setNodes={setNodes}
        setEdges={setEdges}
        onAddNode={createNode}
        onDelete={deleteSelectedElements}
      />
      <Panel
        position="bottom-left"
        style={{ fontSize: "12px", color: "#666" }}
      />
      <MiniMap />
    </ReactFlow>
  );
};

export default Canvas;
