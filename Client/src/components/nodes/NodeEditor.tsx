import React, { useState, useEffect } from "react";
import NodeTypeEditor from "./NodeTypeEditor";
import AttributeEditor from "./AttributeEditor";
import { NodeEditorProps, AttributeEntry } from "./types";

const NodeEditor: React.FC<NodeEditorProps> = ({
  nodeData,
  onSave,
  onCancel,
  showPrompt,
}) => {
  const [editNodeType, setEditNodeType] = useState(nodeData.nodeType);
  const [editAttributes, setEditAttributes] = useState<AttributeEntry[]>([]);

  useEffect(() => {
    setEditNodeType(nodeData.nodeType);
    setEditAttributes(
      Object.entries(nodeData.attributes || {}).map(([key, value]) => ({
        key,
        value,
      }))
    );
  }, [nodeData]);

  const handleSave = () => {
    const attributesObject = editAttributes.reduce((acc, { key, value }) => {
      if (key.trim()) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    onSave({
      nodeType: editNodeType,
      attributes: attributesObject,
    });
  };

  const handleCancel = () => {
    setEditNodeType(nodeData.nodeType);
    setEditAttributes(
      Object.entries(nodeData.attributes || {}).map(([key, value]) => ({
        key,
        value,
      }))
    );
    onCancel();
  };

  return (
    <div className="dynamic-node editing">
      <div className="node-editor">
        <NodeTypeEditor
          nodeType={editNodeType}
          onNodeTypeChange={setEditNodeType}
        />

        <AttributeEditor
          attributes={editAttributes}
          onAttributesChange={setEditAttributes}
          showPrompt={showPrompt}
        />

        <div className="node-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NodeEditor;
