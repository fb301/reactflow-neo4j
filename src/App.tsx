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

const getNodeId = () => crypto.randomUUID();
const labelStyle = { fill: "#6b3d17ff", fontWeight: 700 };
const labelBgPadding = [8, 4] as [number, number];
const labelBgBorderRadius = 4;
const labelBgStyle = { fill: "#ffcc00", fillOpacity: 0.7 };

const initialNodes = [
  {
    id: "1",
    data: { label: "Node 1" },
    position: { x: 0, y: -50 },
  },
  { id: "2", data: { label: "Node 2" }, position: { x: 0, y: 50 } },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    label: "connects to",
    labelStyle,
    labelBgPadding,
    labelBgBorderRadius,
    labelBgStyle,
  },
];

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback(
    (params) => {
      const label = prompt(
        "Enter a label for this connection:",
        "connected to"
      );

      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        label: label || "connected to",
        labelStyle,
        labelBgPadding,
        labelBgBorderRadius,
        labelBgStyle,
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log(JSON.stringify(flow));

      // Send flow data to Flask API
      fetch("http://localhost:5001/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flow),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error saving flow data");
        });
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      try {
        // Restore from Flask API
        const response = await fetch("http://localhost:5001/api/restore");
        const result = await response.json();

        if (result.status === "success" && result.data) {
          const flow = result.data;
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          setViewport({ x, y, zoom });
          console.log("Restored from Flask API:", flow);
        } else {
          alert("No saved data found on server!");
        }
      } catch (error) {
        console.error("Error restoring from Flask API:", error);
        alert("Error restoring data from server!");
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      const newLabel = prompt("Edit edge label:", edge.label || "");

      if (newLabel !== null) {
        setEdges((edges) =>
          edges.map((e) =>
            e.id === edge.id
              ? {
                  ...e,
                  label: newLabel,
                  labelStyle,
                  labelBgPadding,
                  labelBgBorderRadius,
                  labelBgStyle,
                }
              : e
          )
        );
      }
    },
    [setEdges]
  );

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
      onEdgesChange={onEdgesChange}
      onInit={(instance) => setRfInstance(instance as any)}
      onConnect={onConnect}
      onEdgeDoubleClick={onEdgeDoubleClick}
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
