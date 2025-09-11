export interface PromptProps {
  isOpen: boolean;
  title: string;
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}
