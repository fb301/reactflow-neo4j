import React from "react";
import { AddNodeButtonProps } from "../types";

export const AddNodeButton: React.FC<AddNodeButtonProps> = ({
  onAddNode,
  className = "xy-theme__button",
  children = "add node",
}) => {
  return (
    <button className={className} onClick={onAddNode}>
      {children}
    </button>
  );
};
