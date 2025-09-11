import { useState, useCallback } from "react";

interface PromptOptions {
  title: string;
  defaultValue?: string;
}

export const usePrompt = () => {
  const [promptState, setPromptState] = useState<{
    isOpen: boolean;
    title: string;
    defaultValue: string;
    resolve: ((value: string | null) => void) | null;
  }>({
    isOpen: false,
    title: "",
    defaultValue: "",
    resolve: null,
  });

  const showPrompt = useCallback(
    (options: PromptOptions): Promise<string | null> => {
      return new Promise((resolve) => {
        setPromptState({
          isOpen: true,
          title: options.title,
          defaultValue: options.defaultValue || "",
          resolve,
        });
      });
    },
    []
  );

  const handleConfirm = useCallback(
    (value: string) => {
      if (promptState.resolve) {
        promptState.resolve(value);
      }
      setPromptState((prev) => ({ ...prev, isOpen: false, resolve: null }));
    },
    [promptState.resolve]
  );

  const handleCancel = useCallback(() => {
    if (promptState.resolve) {
      promptState.resolve(null);
    }
    setPromptState((prev) => ({ ...prev, isOpen: false, resolve: null }));
  }, [promptState.resolve]);

  return {
    showPrompt,
    promptProps: {
      isOpen: promptState.isOpen,
      title: promptState.title,
      defaultValue: promptState.defaultValue,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  };
};
