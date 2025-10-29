"use client";

import { Machine, MachineType } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { addMachine, updateMachine } from "@/store/slices/machinesSlice";
import { useState, FormEvent } from "react";

interface MachineFormModalProps {
  machineType: MachineType;
  machine?: Machine;
  onClose: () => void;
}

export default function MachineFormModal({
  machineType,
  machine,
  onClose,
}: MachineFormModalProps) {
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<
    Record<string, string | number | boolean>
  >(machine?.values ?? {});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate that the title attribute has a value (title is always required)
    if (machineType.titleAttributeId) {
      const titleValue = values[machineType.titleAttributeId];
      const titleAttr = machineType.attributes.find(a => a.id === machineType.titleAttributeId);
      
      // Validation based on type
      let isValid = false;
      if (titleAttr?.type === 'checkbox') {
        // Checkbox must be explicitly set to true or false (not undefined)
        isValid = typeof titleValue === 'boolean';
      } else if (titleAttr?.type === 'number') {
        // Number must exist and not be NaN
        isValid = titleValue !== undefined && titleValue !== null && titleValue !== '' && !isNaN(Number(titleValue));
      } else {
        // Text and date must not be empty
        isValid = titleValue !== undefined && titleValue !== null && 
                 (typeof titleValue === 'string' ? titleValue.trim() !== '' : String(titleValue) !== '');
      }
      
      if (!isValid) {
        alert(`Please provide a value for "${titleAttr?.name || 'title'}" (this is the title attribute)`);
        return;
      }
    }

    if (machine) {
      dispatch(updateMachine({ ...machine, values }));
    } else {
      const newMachine: Machine = {
        id: Date.now().toString(),
        typeId: machineType.id,
        values,
      };
      dispatch(addMachine(newMachine));
    }

    onClose();
  };

  const handleChange = (
    attrId: string,
    value: string | number | boolean,
    type: string
  ) => {
    let processedValue: string | number | boolean = value;

    if (type === "number" && typeof value === "string") {
      processedValue = parseFloat(value) || 0;
    } else if (type === "checkbox") {
      processedValue = value as boolean;
    }

    setValues({ ...values, [attrId]: processedValue });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        style={{ backgroundColor: "hsl(var(--color-card))" }}
        className="rounded-lg shadow-elevation-high max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {machine ? "Edit" : "Add"} {machineType.name}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {machineType.attributes.map((attr) => (
              <div key={attr.id}>
                <label className="block text-sm font-medium mb-2">
                  {attr.name}
                  {machineType.titleAttributeId === attr.id && (
                    <span style={{ color: 'hsl(var(--color-primary))' }} className="ml-2 text-xs">
                      (Title)
                    </span>
                  )}
                </label>

                {attr.type === "text" && (
                  <input
                    type="text"
                    value={(values[attr.id] as string) ?? ""}
                    onChange={(e) =>
                      handleChange(attr.id, e.target.value, attr.type)
                    }
                    style={{
                      backgroundColor: "hsl(var(--color-background))",
                    }}
                    className="w-full px-3 py-2 rounded-lg shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                )}

                {attr.type === "number" && (
                  <input
                    type="number"
                    step="any"
                    value={(values[attr.id] as number) ?? ""}
                    onChange={(e) =>
                      handleChange(attr.id, e.target.value, attr.type)
                    }
                    style={{
                      backgroundColor: "hsl(var(--color-background))",
                    }}
                    className="w-full px-3 py-2 rounded-lg shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                )}

                {attr.type === "date" && (
                  <input
                    type="date"
                    value={(values[attr.id] as string) ?? ""}
                    onChange={(e) =>
                      handleChange(attr.id, e.target.value, attr.type)
                    }
                    style={{
                      backgroundColor: "hsl(var(--color-background))",
                    }}
                    className="w-full px-3 py-2 rounded-lg shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                )}

                {attr.type === "checkbox" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={values[attr.id] === true}
                      onChange={(e) =>
                        handleChange(attr.id, e.target.checked, attr.type)
                      }
                      className="w-5 h-5 rounded"
                    />
                    {values[attr.id] === undefined && (
                      <span style={{ color: 'hsl(var(--color-muted-foreground))' }} className="text-xs">
                        (Not set)
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                style={{
                  backgroundColor: "hsl(var(--color-primary))",
                  color: "hsl(var(--color-primary-foreground))",
                }}
                className="flex-1 px-4 py-2 rounded-lg transition hover:opacity-90"
              >
                {machine ? "Update" : "Add"}
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
