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
import { SAVE_FLOW, RESTORE_FLOW } from "./gql/queries.js";
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
        labelStyle={{ fill: "#6b3d17ff", fontWeight: 700 }}
        labelShowBg
        labelBgStyle={{ fill: "#ffcc00", fillOpacity: 0.7 }}
        labelBgPadding={[8, 4]}
        labelBgBorderRadius={4}
      />
    </>
  );
};

const edgeTypes = {
  "custom-labeled": CustomLabeledEdge,
};

const getNodeId = () => crypto.randomUUID();

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
    type: "custom-labeled",
    data: { label: "connects to" },
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
        type: "custom-labeled",
        data: { label: label || "connected to" },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onSave = useCallback(async () => {
    if (rfInstance) {
      try {
        const flow = rfInstance.toObject();

        const graphqlData = {
          nodes: flow.nodes.map((node) => ({
            id: node.id,
            data: { label: node.data.label },
            position: { x: node.position.x, y: node.position.y },
            type: node.type || "default",
          })),
          relationships: flow.edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || "default",
            data: edge.data ? { label: edge.data.label } : null,
          })),
        };

        await client.mutate({
          mutation: SAVE_FLOW,
          variables: { flowData: graphqlData },
        });
        console.log("Data save sucess");
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }, [rfInstance]);

  const onRestore = useCallback(async () => {
    try {
      type RestoreFlowResult = {
        restoreFlow?: {
          nodes?: any[];
          relationships?: any[];
        };
      };

      const result = await client.query<RestoreFlowResult>({
        query: RESTORE_FLOW,
        fetchPolicy: "network-only",
      });

      const data = result.data?.restoreFlow;
      if (data) {
        setNodes(data.nodes || []);
        setEdges(data.relationships || []);
      }
      console.log("Data restored success");
    } catch (error) {
      console.log("Error restoring flow:", error);
    }
  }, [setNodes, setEdges, setViewport]);

  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      const currentLabel = edge.data?.label || edge.label || "";
      const newLabel = prompt("Edit edge label:", currentLabel);

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
