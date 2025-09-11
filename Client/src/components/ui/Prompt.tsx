import React, { useState, useEffect, useRef } from "react";
import { PromptProps } from "./types";

export const Prompt: React.FC<PromptProps> = ({
  isOpen,
  title,
  defaultValue = "",
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="prompt-overlay" onClick={onCancel}>
      <div className="prompt-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="prompt-title">{title}</div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="prompt-input"
          />
          <div className="prompt-buttons">
            <button type="button" onClick={onCancel} className="prompt-cancel">
              Cancel
            </button>
            <button type="submit" className="prompt-confirm">
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
