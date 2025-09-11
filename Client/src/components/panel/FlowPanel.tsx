import React from "react";
import { Panel } from "@xyflow/react";
import { AddNodeButton, SaveButton, RestoreButton, DeleteButton } from ".";
import { FlowPanelProps } from "./types";

export const FlowPanel: React.FC<FlowPanelProps> = ({
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
