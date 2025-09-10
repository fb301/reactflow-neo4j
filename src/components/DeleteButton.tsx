import React from "react";

interface DeleteButtonProps {
  onDelete: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  className = "xy-theme__button",
  style = { backgroundColor: "#fafafaff", borderColor: "#ff5252" },
  children = "delete selected",
}) => {
  return (
    <button className={className} onClick={onDelete} style={style}>
      {children}
    </button>
  );
};

export default DeleteButton;
