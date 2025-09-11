import React, { useState } from "react";
import {
  Background,
  BackgroundVariant,
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
import { CustomLabeledEdge } from "../edges/CustomLabeledEdge";
import { FlowPanel } from "../panel";
import { useDeletionOperations } from "../../hooks/useDeletionOperations";
import { useDeleteKeyboard } from "./hooks/useDeleteKeyboard";
import { useNodeCreator } from "../../hooks/useNodeCreator";
import { useEdgeOperations } from "../../hooks/useEdgeOperations";
import { PromptProvider } from "../ui";
import { CanvasProps } from "./types";

const nodeTypes = {
  dynamic: CustomNode,
};

const edgeTypes = {
  "custom-labeled": CustomLabeledEdge,
};

export const Canvas: React.FC<CanvasProps> = ({
  initialNodes,
  initialEdges,
  showPrompt,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const { createNode } = useNodeCreator({ setNodes, showPrompt });
  const { onConnect, onEdgeDoubleClick } = useEdgeOperations({
    setEdges,
    showPrompt,
  });
  const { deleteSelectedElements, onNodeContextMenu, onEdgeContextMenu } =
    useDeletionOperations({
      nodes,
      edges,
      setNodes,
      setEdges,
      showPrompt,
    });

  useDeleteKeyboard({ deleteSelectedElements });

  return (
    <PromptProvider showPrompt={showPrompt}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Background variant={BackgroundVariant.Dots} />
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
    </PromptProvider>
  );
};
