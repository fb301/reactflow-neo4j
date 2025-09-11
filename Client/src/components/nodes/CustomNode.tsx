import React from "react";
import { NodeProps } from "@xyflow/react";
import NodeEditor from "./NodeEditor";
import NodeViewer from "./NodeViewer";
import { useNodeEditor } from "./useNodeEditor";
import { NodeData } from "./types";
import "./DynamicNode.css";

const CustomNode: React.FC<NodeProps> = ({ data, id }) => {
  const nodeData = data as unknown as NodeData;
  const { isEditing, startEditing, saveNode, cancelEdit } = useNodeEditor(
    nodeData,
    id
  );

  if (isEditing) {
    return (
      <NodeEditor nodeData={nodeData} onSave={saveNode} onCancel={cancelEdit} />
    );
  }

  return <NodeViewer nodeData={nodeData} onEdit={startEditing} />;
};

export default CustomNode;
