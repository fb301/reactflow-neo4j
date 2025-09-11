import React from "react";

interface AddNodeButtonProps {
  onAddNode: () => void;
  className?: string;
  children?: React.ReactNode;
}

const AddNodeButton: React.FC<AddNodeButtonProps> = ({
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

export default AddNodeButton;
