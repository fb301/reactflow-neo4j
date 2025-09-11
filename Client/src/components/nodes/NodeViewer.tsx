import React from "react";
import NodeHandles from "./NodeHandles";
import { NodeViewerProps } from "./types";

const NodeViewer: React.FC<NodeViewerProps> = ({ nodeData, onEdit }) => {
  return (
    <div className="dynamic-node" onDoubleClick={onEdit}>
      <NodeHandles />

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
    </div>
  );
};

export default NodeViewer;
