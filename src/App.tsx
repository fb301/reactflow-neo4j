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
  EdgeText,
  getBezierPath,
  type EdgeProps,
  MiniMap,
} from "@xyflow/react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./gql/client.js";
import OnSave from "./components/OnSave";
import OnRestore from "./components/OnRestore";
import DynamicNode from "./components/DynamicNode";
import "@xyflow/react/dist/style.css";

const CustomLabeledEdge = (props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
  } = props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{ stroke: "#b1b1b7", strokeWidth: 2 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeText
        x={labelX}
        y={labelY}
        label={String(data?.label || "connects to")}
        labelStyle={{ fill: "#080808ff", fontWeight: 700 }}
        labelShowBg
        labelBgStyle={{ fill: "#868686ff", fillOpacity: 0.7 }}
        labelBgPadding={[8, 4]}
        labelBgBorderRadius={4}
      />
    </>
  );
};

const edgeTypes = {
  "custom-labeled": CustomLabeledEdge,
};

const nodeTypes = {
  dynamic: DynamicNode,
};

const getNodeId = () => crypto.randomUUID();

import type { Node, Edge } from "@xyflow/react";

const firstNode = getNodeId();
const secondNode = getNodeId();

const initialNodes: Node[] = [
  {
    id: firstNode,
    type: "dynamic",
    data: {
      nodeType: "Actor",
      attributes: { Name: "Tom Hanks", Age: "67" },
    },
    position: { x: 0, y: -100 },
  },
  {
    id: secondNode,
    type: "dynamic",
    data: {
      nodeType: "Movie",
      attributes: { Title: "Forrest Gump", Year: "1994" },
    },
    position: { x: 0, y: 100 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: firstNode,
    target: secondNode,
    type: "custom-labeled",
    data: { label: "ACTED_IN" },
  },
];
const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback(
    (params) => {
      const label = prompt("Enter a label for this connection:", "connected");

      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        type: "custom-labeled",
        data: { label: label || "connected" },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      const currentEdgeLabel = edge.data?.label || edge.label || "";
      const newLabel = prompt("Edit edge label:", currentEdgeLabel);

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
    [setEdges]
  );

  const onAdd = useCallback(() => {
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
      fitView
      fitViewOptions={{ padding: 2 }}
    >
      <Background />
      <Panel position="top-right">
        <OnSave rfInstance={rfInstance} />
        <OnRestore setNodes={setNodes} setEdges={setEdges} />
        <button className="xy-theme__button" onClick={onAdd}>
          add node
        </button>
      </Panel>
      <MiniMap />
    </ReactFlow>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <ReactFlowProvider>
      <SaveRestore />
    </ReactFlowProvider>
  </ApolloProvider>
);
