import React, { useState, useCallback, useEffect } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";
import "./DynamicNode.css";

interface DynamicNodeData {
  nodeType: string;
  attributes: Record<string, string>;
}

interface AttributeEntry {
  key: string;
  value: string;
}

const DynamicNode: React.FC<NodeProps> = ({ data, id }) => {
  const nodeData = data as unknown as DynamicNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<DynamicNodeData>(nodeData);
  const [editAttributes, setEditAttributes] = useState<AttributeEntry[]>([]);
  const { setNodes } = useReactFlow();

  // Sync editData with nodeData when it changes
  useEffect(() => {
    setEditData(nodeData);
    // Convert attributes object to array for stable editing
    setEditAttributes(
      Object.entries(nodeData.attributes || {}).map(([key, value]) => ({
        key,
        value,
      }))
    );
  }, [nodeData]);

  const handleSave = useCallback(() => {
    // Convert editAttributes array back to attributes object
    const attributesObject = editAttributes.reduce((acc, { key, value }) => {
      if (key.trim()) {
        // Only include non-empty keys
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    const finalEditData = {
      ...editData,
      attributes: attributesObject,
    };

    // Update the node data in ReactFlow
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: finalEditData as unknown as Record<string, unknown>,
            }
          : node
      )
    );
    setIsEditing(false);
  }, [editData, editAttributes, id, setNodes]);

  const handleCancel = useCallback(() => {
    setEditData(nodeData); // Reset to original data
    setEditAttributes(
      Object.entries(nodeData.attributes || {}).map(([key, value]) => ({
        key,
        value,
      }))
    );
    setIsEditing(false);
  }, [nodeData]);

  const addAttribute = useCallback(() => {
    const key = prompt("Attribute name:");
    const value = prompt("Attribute value:");
    if (key && value) {
      setEditAttributes((prev) => [...prev, { key, value }]);
    }
  }, []);

  const removeAttribute = useCallback((index: number) => {
    setEditAttributes((prev) => prev.filter((_, i) => i !== index));
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
            {editAttributes.map(({ key, value }, index) => (
              <div key={`attr-${index}`} className="attribute-row">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    const newKey = e.target.value;
                    setEditAttributes((prev) =>
                      prev.map((attr, i) =>
                        i === index ? { ...attr, key: newKey } : attr
                      )
                    );
                  }}
                  placeholder="Attribute name"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setEditAttributes((prev) =>
                      prev.map((attr, i) =>
                        i === index ? { ...attr, value: newValue } : attr
                      )
                    );
                  }}
                  placeholder="Value"
                />
                <button onClick={() => removeAttribute(index)}>×</button>
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
