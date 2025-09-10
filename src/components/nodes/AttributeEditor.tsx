import React, { useCallback } from "react";
import { AttributeEntry, AttributeEditorProps } from "./types";

const AttributeEditor: React.FC<AttributeEditorProps> = ({
  attributes,
  onAttributesChange,
}) => {
  const addAttribute = useCallback(() => {
    const key = prompt("Attribute name:");
    const value = prompt("Attribute value:");
    if (key && value) {
      onAttributesChange([...attributes, { key, value }]);
    }
  }, [attributes, onAttributesChange]);

  const removeAttribute = useCallback(
    (index: number) => {
      onAttributesChange(attributes.filter((_, i) => i !== index));
    },
    [attributes, onAttributesChange]
  );

  const updateAttribute = useCallback(
    (index: number, field: keyof AttributeEntry, value: string) => {
      onAttributesChange(
        attributes.map((attr, i) =>
          i === index ? { ...attr, [field]: value } : attr
        )
      );
    },
    [attributes, onAttributesChange]
  );

  return (
    <div className="attributes-section">
      <label>Attributes:</label>
      {attributes.map(({ key, value }, index) => (
        <div key={`attr-${index}`} className="attribute-row">
          <input
            type="text"
            value={key}
            onChange={(e) => updateAttribute(index, "key", e.target.value)}
            placeholder="Attribute name"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => updateAttribute(index, "value", e.target.value)}
            placeholder="Value"
          />
          <button onClick={() => removeAttribute(index)}>×</button>
        </div>
      ))}
      <button onClick={addAttribute} className="add-attribute">
        + Add Attribute
      </button>
    </div>
  );
};

export default AttributeEditor;
