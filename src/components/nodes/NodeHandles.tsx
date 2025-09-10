import React from "react";
import { Handle, Position } from "@xyflow/react";

const NodeHandles: React.FC = () => {
  return (
    <>
      {/* Top */}
      <Handle type="target" position={Position.Top} id="top-target" />
      <Handle type="source" position={Position.Top} id="top-source" />

      {/* Bottom */}
      <Handle type="target" position={Position.Bottom} id="bottom-target" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" />
    </>
  );
};

export default NodeHandles;
