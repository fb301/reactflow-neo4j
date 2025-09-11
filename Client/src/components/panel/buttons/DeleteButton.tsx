import React from "react";
import { DeleteButtonProps } from "../types";

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  className = "xy-theme__button",
  children = "delete selected",
}) => {
  return (
    <button className={className} onClick={onDelete}>
      {children}
    </button>
  );
};
