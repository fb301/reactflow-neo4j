import React, { useState, useCallback } from "react";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const flowKey = "example-flow";

const getNodeId = () => `randomnode_${+new Date()}`;

const initialNodes = [
  { id: "1", data: { label: "Node 1" }, position: { x: 0, y: -50 } },
  { id: "2", data: { label: "Node 2" }, position: { x: 0, y: 50 } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const storedFlow = localStorage.getItem(flowKey);
      if (storedFlow) {
        const flow = JSON.parse(storedFlow);
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: "Added node" },
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onInit={(instance) => setRfInstance(instance)}
      onConnect={onConnect}
      onInit={setRfInstance}
      fitView
      fitViewOptions={{ padding: 2 }}
    >
      <Background />
      <Panel position="top-right">
        <button className="xy-theme__button" onClick={onSave}>
          save
        </button>
        <button className="xy-theme__button" onClick={onRestore}>
          restore
        </button>
        <button className="xy-theme__button" onClick={onAdd}>
          add node
        </button>
      </Panel>
    </ReactFlow>
  );
};

export default () => (
  <ReactFlowProvider>
    <SaveRestore />
  </ReactFlowProvider>
);
