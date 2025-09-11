import { Node, Edge, ReactFlowInstance } from "@xyflow/react";

export interface FlowPanelProps {
  rfInstance: ReactFlowInstance | null;
  setNodes: any;
  setEdges: any;
  onAddNode: () => void;
  onDelete: () => void;
}

export interface SaveButtonProps {
  rfInstance: ReactFlowInstance | null;
}

export interface AddNodeButtonProps {
  onAddNode: () => void;
  className?: string;
  children?: React.ReactNode;
}

export interface DeleteButtonProps {
  onDelete: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface RestoreButtonProps {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}
