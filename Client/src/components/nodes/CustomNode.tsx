import React from "react";
import { NodeProps } from "@xyflow/react";
import { NodeEditor } from "./NodeEditor";
import { NodeViewer } from "./NodeViewer";
import { NodeHandles } from "./NodeHandles";
import { useNodeEditor } from "./hooks/useNodeEditor";
import { NodeData } from "./types";
import { usePrompt } from "../ui/contexts/PromptContext";

export const CustomNode: React.FC<NodeProps> = ({ data, id }) => {
  const nodeData = data as unknown as NodeData;
  const { showPrompt } = usePrompt();
  const { isEditing, startEditing, saveNode, cancelEdit } = useNodeEditor(
    nodeData,
    id
  );

  return (
    <>
      <NodeHandles />

      {isEditing ? (
        <NodeEditor
          nodeData={nodeData}
          onSave={saveNode}
          onCancel={cancelEdit}
          showPrompt={showPrompt}
        />
      ) : (
        <NodeViewer nodeData={nodeData} onEdit={startEditing} />
      )}
    </>
  );
};
