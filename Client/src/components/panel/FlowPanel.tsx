import React from "react";
import { Panel, ReactFlowInstance } from "@xyflow/react";
import SaveButton from "./SaveButton";
import RestoreButton from "./RestoreButton";
import DeleteButton from "./DeleteButton";
import AddNodeButton from "./AddNodeButton";

interface FlowPanelProps {
  rfInstance: ReactFlowInstance | null;
  setNodes: any;
  setEdges: any;
  onAddNode: () => void;
  onDelete: () => void;
}

const FlowPanel: React.FC<FlowPanelProps> = ({
  rfInstance,
  setNodes,
  setEdges,
  onAddNode,
  onDelete,
}) => {
  return (
    <Panel position="top-right">
      <div className="panel-buttons">
        <SaveButton rfInstance={rfInstance} />
        <RestoreButton setNodes={setNodes} setEdges={setEdges} />
        <AddNodeButton onAddNode={onAddNode} />
        <DeleteButton onDelete={onDelete} />
      </div>
    </Panel>
  );
};

export default FlowPanel;
