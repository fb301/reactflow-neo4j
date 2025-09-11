import React from "react";
import { NodeTypeEditorProps } from "./types";

const NodeTypeEditor: React.FC<NodeTypeEditorProps> = ({
  nodeType,
  onNodeTypeChange,
}) => {
  return (
    <div className="node-type-section">
      <label>Node Type:</label>
      <input
        type="text"
        value={nodeType}
        onChange={(e) => onNodeTypeChange(e.target.value)}
        placeholder="e.g., Actor, Movie, Director"
      />
    </div>
  );
};

export default NodeTypeEditor;
