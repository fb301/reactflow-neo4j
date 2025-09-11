import { useEffect } from "react";

interface UseDeleteKeyboardProps {
  deleteSelectedElements: () => void;
}

export const useDeleteKeyboard = ({
  deleteSelectedElements,
}: UseDeleteKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (
          event.target instanceof HTMLElement &&
          event.target.tagName !== "INPUT" &&
          event.target.tagName !== "TEXTAREA" &&
          !event.target.isContentEditable
        ) {
          event.preventDefault();
          deleteSelectedElements();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelectedElements]);
};
