import React, { useState, useCallback, useEffect } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";
import "./DynamicNode.css";

interface DynamicNodeData {
  nodeType: string;
  attributes: Record<string, string>;
}

const DynamicNode: React.FC<NodeProps> = ({ data, id }) => {
  const nodeData = data as unknown as DynamicNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<DynamicNodeData>(nodeData);
  const { setNodes } = useReactFlow();

  // Sync editData with nodeData when it changes
  useEffect(() => {
    setEditData(nodeData);
  }, [nodeData]);

  const handleSave = useCallback(() => {
    // Update the node data in ReactFlow
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: editData as unknown as Record<string, unknown> }
          : node
      )
    );
    setIsEditing(false);
  }, [editData, id, setNodes]);

  const handleCancel = useCallback(() => {
    setEditData(nodeData); // Reset to original data
    setIsEditing(false);
  }, [nodeData]);

  const addAttribute = useCallback(() => {
    const key = prompt("Attribute name:");
    const value = prompt("Attribute value:");
    if (key && value) {
      setEditData((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [key]: value },
      }));
    }
  }, []);

  const removeAttribute = useCallback((key: string) => {
    setEditData((prev) => ({
      ...prev,
      attributes: Object.fromEntries(
        Object.entries(prev.attributes).filter(([k]) => k !== key)
      ),
    }));
  }, []);

  if (isEditing) {
    return (
      <div className="dynamic-node editing">
        <Handle type="target" position={Position.Top} />

        <div className="node-editor">
          <div className="node-type-section">
            <label>Node Type:</label>
            <input
              type="text"
              value={editData.nodeType}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, nodeType: e.target.value }))
              }
              placeholder="e.g., Actor, Movie, Director"
            />
          </div>

          <div className="attributes-section">
            <label>Attributes:</label>
            {Object.entries(editData.attributes).map(([key, value]) => (
              <div key={key} className="attribute-row">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    const newKey = e.target.value;
                    const newAttrs = { ...editData.attributes };
                    delete newAttrs[key];
                    newAttrs[newKey] = value;
                    setEditData((prev) => ({ ...prev, attributes: newAttrs }));
                  }}
                  placeholder="Attribute name"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    setEditData((prev) => ({
                      ...prev,
                      attributes: { ...prev.attributes, [key]: e.target.value },
                    }));
                  }}
                  placeholder="Value"
                />
                <button onClick={() => removeAttribute(key)}>×</button>
              </div>
            ))}
            <button onClick={addAttribute} className="add-attribute">
              + Add Attribute
            </button>
          </div>

          <div className="node-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }

  return (
    <div className="dynamic-node" onDoubleClick={() => setIsEditing(true)}>
      <Handle type="target" position={Position.Top} />

      <div className="node-content">
        <div className="node-type">{nodeData.nodeType}</div>
        <div className="node-attributes">
          {Object.entries(nodeData.attributes || {}).map(([key, value]) => (
            <div key={key} className="attribute">
              <span className="attr-key">{key}:</span>
              <span className="attr-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default DynamicNode;
