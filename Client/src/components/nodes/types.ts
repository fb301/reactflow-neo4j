export interface NodeData {
  nodeType: string;
  attributes: Record<string, string>;
}

export interface AttributeEntry {
  key: string;
  value: string;
}

export interface NodeEditorProps {
  nodeData: NodeData;
  onSave: (data: NodeData) => void;
  onCancel: () => void;
  showPrompt: (options: {
    title: string;
    defaultValue?: string;
  }) => Promise<string | null>;
}

export interface NodeViewerProps {
  nodeData: NodeData;
  onEdit: () => void;
}

export interface AttributeEditorProps {
  attributes: AttributeEntry[];
  onAttributesChange: (attributes: AttributeEntry[]) => void;
  showPrompt: (options: {
    title: string;
    defaultValue?: string;
  }) => Promise<string | null>;
}

export interface NodeHandlesProps {}

export interface NodeTypeEditorProps {
  nodeType: string;
  onNodeTypeChange: (nodeType: string) => void;
}
