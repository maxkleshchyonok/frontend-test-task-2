"use client";

import { MachineType, Attribute, AttributeType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addMachineType,
  updateMachineType,
} from "@/store/slices/machineTypesSlice";
import { syncMachinesWithTypeChange } from "@/store/slices/machinesSlice";
import { useState, FormEvent } from "react";

interface MachineTypeFormProps {
  machineType?: MachineType;
  onClose: () => void;
}

export default function MachineTypeForm({
  machineType,
  onClose,
}: MachineTypeFormProps) {
  const dispatch = useAppDispatch();
  const existingTypes = useAppSelector((state) => state.machineTypes.types);
  const [typeName, setTypeName] = useState(machineType?.name ?? "");

  const [attributes, setAttributes] = useState<Attribute[]>(() => {
    if (machineType?.attributes) {
      return machineType.attributes;
    }
    const initialAttr: Attribute = {
      id: Date.now().toString(),
      name: "",
      type: "text",
    };
    return [initialAttr];
  });

  const [titleAttributeId, setTitleAttributeId] = useState<string | undefined>(
    () => {
      if (machineType?.titleAttributeId) {
        return machineType.titleAttributeId;
      }
      return machineType ? undefined : attributes[0]?.id;
    }
  );

  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!typeName.trim()) {
      setError("Machine Type name is required");
      return;
    }

    const isDuplicate = existingTypes.some(
      (type) =>
        type.name.toLowerCase() === typeName.trim().toLowerCase() &&
        type.id !== machineType?.id
    );

    if (isDuplicate) {
      setError(
        "This Machine Type name already exists. Please use a unique name."
      );
      return;
    }

    const finalTitleAttributeId =
      titleAttributeId ||
      (attributes.length > 0 ? attributes[0].id : undefined);

    const typeData: MachineType = {
      id: machineType?.id ?? Date.now().toString(),
      name: typeName.trim(),
      attributes,
      titleAttributeId: finalTitleAttributeId,
    };

    if (machineType) {
      const oldTitleAttributeId = machineType.titleAttributeId;

      const oldAttributeIds = new Set(machineType.attributes.map((a) => a.id));
      const newAttributeIds = new Set(attributes.map((a) => a.id));
      const removedAttributeIds = Array.from(oldAttributeIds).filter(
        (id) => !newAttributeIds.has(id)
      );
      const addedAttributeIds = Array.from(newAttributeIds).filter(
        (id) => !oldAttributeIds.has(id)
      );

      const oldTitleAttr = machineType.attributes.find(
        (a) => a.id === oldTitleAttributeId
      );
      const newTitleAttr = attributes.find(
        (a) => a.id === finalTitleAttributeId
      );

      dispatch(updateMachineType(typeData));

      if (
        oldTitleAttributeId !== finalTitleAttributeId ||
        removedAttributeIds.length > 0 ||
        addedAttributeIds.length > 0
      ) {
        dispatch(
          syncMachinesWithTypeChange({
            typeId: typeData.id,
            oldTitleAttributeId,
            newTitleAttributeId: finalTitleAttributeId,
            removedAttributeIds,
            addedAttributeIds,
            oldTitleAttributeType: oldTitleAttr?.type,
            newTitleAttributeType: newTitleAttr?.type,
          })
        );
      }
    } else {
      dispatch(addMachineType(typeData));
    }

    onClose();
  };

  const addAttribute = () => {
    const newAttr: Attribute = {
      id: Date.now().toString(),
      name: "",
      type: "text",
    };
    const updatedAttributes = [...attributes, newAttr];
    setAttributes(updatedAttributes);

    if (attributes.length === 0) {
      setTitleAttributeId(newAttr.id);
    }
  };

  const updateAttribute = (
    index: number,
    field: keyof Attribute,
    value: string
  ) => {
    const updated = attributes.map((attr, i) => {
      if (i === index) {
        if (field === "type") {
          return { ...attr, [field]: value as AttributeType };
        } else {
          return { ...attr, [field]: value };
        }
      }
      return attr;
    });
    setAttributes(updated);
  };

  const removeAttribute = (index: number) => {
    const attrToRemove = attributes[index];
    const remainingAttributes = attributes.filter((_, i) => i !== index);

    if (
      titleAttributeId === attrToRemove.id &&
      remainingAttributes.length > 0
    ) {
      setTitleAttributeId(remainingAttributes[0].id);
    }

    setAttributes(remainingAttributes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        style={{ backgroundColor: "hsl(var(--color-card))" }}
        className="rounded-lg shadow-elevation-high max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {machineType ? "Edit" : "Create"} Machine Type
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Machine Type Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={typeName}
                onChange={(e) => {
                  setTypeName(e.target.value);
                  setError("");
                }}
                placeholder="e.g., Bulldozer, Chainsaw, Crane"
                style={{ backgroundColor: "hsl(var(--color-background))" }}
                className="w-full px-3 py-2 rounded-lg shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                required
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <p
                style={{ color: "hsl(var(--color-muted-foreground))" }}
                className="text-xs mt-1"
              >
                Must be unique across all machine types
              </p>
            </div>

            {attributes.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title Attribute <span className="text-red-500">*</span>
                </label>
                <select
                  value={
                    titleAttributeId ||
                    (attributes.length > 0 ? attributes[0].id : "")
                  }
                  onChange={(e) => {
                    setTitleAttributeId(e.target.value);
                  }}
                  style={{ backgroundColor: "hsl(var(--color-background))" }}
                  className="w-full px-3 py-2 rounded-lg shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  required
                >
                  {attributes.map((attr) => (
                    <option key={attr.id} value={attr.id}>
                      {attr.name || "Unnamed"} ({attr.type})
                    </option>
                  ))}
                </select>
                <p
                  style={{ color: "hsl(var(--color-muted-foreground))" }}
                  className="text-xs mt-1"
                >
                  Machine title will be the value of &quot;
                  {attributes.find(
                    (a) => a.id === (titleAttributeId || attributes[0].id)
                  )?.name || "selected attribute"}
                  &quot;
                </p>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">
                  Additional Attributes
                </label>
                <button
                  type="button"
                  onClick={addAttribute}
                  style={{
                    backgroundColor: "hsl(var(--color-primary))",
                    color: "hsl(var(--color-primary-foreground))",
                  }}
                  className="px-3 py-1 rounded text-sm transition hover:opacity-90"
                >
                  + Add Attribute
                </button>
              </div>

              <div className="space-y-3">
                {attributes.map((attr, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: "hsl(var(--color-muted) / 0.3)" }}
                    className="flex gap-2 items-start p-3 rounded-lg shadow-elevation-low"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={attr.name}
                        onChange={(e) =>
                          updateAttribute(index, "name", e.target.value)
                        }
                        placeholder="Attribute name"
                        style={{
                          backgroundColor: "hsl(var(--color-background))",
                        }}
                        className="w-full px-3 py-2 rounded text-sm shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <select
                        value={attr.type}
                        onChange={(e) =>
                          updateAttribute(index, "type", e.target.value)
                        }
                        style={{
                          backgroundColor: "hsl(var(--color-background))",
                          cursor: "pointer",
                        }}
                        className="w-full px-3 py-2 rounded text-sm shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      style={{
                        backgroundColor: "hsl(var(--color-destructive))",
                        color: "hsl(var(--color-destructive-foreground))",
                      }}
                      className="px-3 py-2 rounded text-sm transition hover:opacity-90"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {attributes.length === 0 && (
                  <p
                    style={{ color: "hsl(var(--color-muted-foreground))" }}
                    className="text-sm text-center py-4"
                  >
                    No additional attributes. Click &quot;Add Attribute&quot; to
                    add custom fields.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                style={{
                  backgroundColor: "hsl(var(--color-primary))",
                  color: "hsl(var(--color-primary-foreground))",
                }}
                className="flex-1 px-4 py-2 rounded-lg transition hover:opacity-90"
              >
                {machineType ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: "hsl(var(--color-secondary))",
                  color: "hsl(var(--color-secondary-foreground))",
                }}
                className="flex-1 px-4 py-2 rounded-lg transition hover:opacity-80"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
