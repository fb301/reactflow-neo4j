import { Node, Edge } from "@xyflow/react";

export interface CanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  showPrompt: (options: {
    title: string;
    defaultValue?: string;
  }) => Promise<string | null>;
}
