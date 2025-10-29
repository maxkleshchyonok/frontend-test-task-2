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
  const [manualTitle, setManualTitle] = useState<string>(machine?.title ?? "");

  const getTitle = (): string => {
    if (machineType.titleConfig.type === "linked") {
      const linkedValue = values[machineType.titleConfig.attributeId];
      return typeof linkedValue === "string" ? linkedValue : "";
    }
    return manualTitle;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const finalTitle = getTitle();
    if (!finalTitle.trim()) {
      alert("Please provide a title");
      return;
    }

    if (machine) {
      dispatch(updateMachine({ ...machine, values, title: finalTitle }));
    } else {
      const newMachine: Machine = {
        id: Date.now().toString(),
        typeId: machineType.id,
        values,
        title: finalTitle,
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
            {machine ? "Edit" : "Add"} {machineType.title}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>

              {machineType.titleConfig.type === "manual" ? (
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  style={{ backgroundColor: "hsl(var(--color-background))" }}
                  className="w-full px-3 py-2 rounded-lg shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              ) : (
                <div className="relative">
                  <div
                    style={{
                      backgroundColor: "hsl(var(--color-background))",
                      color: getTitle()
                        ? "inherit"
                        : "hsl(var(--color-muted-foreground))",
                    }}
                    className="w-full px-3 py-2 rounded-lg shadow-elevation-low border border-transparent"
                  >
                    {getTitle() || "Enter the linked field first..."}
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                    <svg
                      className="w-4 h-4"
                      style={{ color: "hsl(var(--color-muted-foreground))" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                </div>
              )}
              {machineType.titleConfig.type === "linked" && (
                <p
                  style={{ color: "hsl(var(--color-muted-foreground))" }}
                  className="text-xs mt-1"
                >
                  Linked to:{" "}
                  {machineType.attributes.find(
                    (a) =>
                      a.id ===
                      (machineType.titleConfig.type === "linked"
                        ? machineType.titleConfig.attributeId
                        : "")
                  )?.name || "Unknown field"}
                </p>
              )}
            </div>

            {machineType.attributes
              .filter((attr) => attr.id !== "title")
              .map((attr) => (
                <div key={attr.id}>
                  <label className="block text-sm font-medium mb-2">
                    {attr.name}
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
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(values[attr.id] as boolean) ?? false}
                        onChange={(e) =>
                          handleChange(attr.id, e.target.checked, attr.type)
                        }
                        className="w-5 h-5 rounded"
                      />
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
