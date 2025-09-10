import { Edge, Node } from "@xyflow/react";
import { getNodeId } from "./idGenerator";

const firstNode = getNodeId();
const secondNode = getNodeId();

export const initialNodes: Node[] = [
  {
    id: firstNode,
    type: "dynamic",
    position: { x: 0, y: -100 },
    data: {
      nodeType: "Actor",
      attributes: {
        name: "Tom Hanks",
        born: 1956,
        nationality: "American",
      },
    },
  },
  {
    id: secondNode,
    type: "dynamic",
    position: { x: 0, y: 100 },
    data: {
      nodeType: "Movie",
      attributes: {
        title: "Forrest Gump",
        released: 1994,
        genre: "Drama",
      },
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: `${firstNode}-${secondNode}`,
    source: firstNode,
    target: secondNode,
    sourceHandle: "bottom-source",
    targetHandle: "top-target",
    type: "custom-labeled",
    data: { label: "ACTED_IN" },
  },
];
