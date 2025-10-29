"use client";

import { Machine, MachineType } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { deleteMachine } from "@/store/slices/machinesSlice";
import { useState } from "react";
import MachineFormModal from "./MachineFormModal";

interface MachineCardProps {
  machine: Machine;
  machineType: MachineType;
}

export default function MachineCard({
  machine,
  machineType,
}: MachineCardProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this machine?")) {
      dispatch(deleteMachine(machine.id));
    }
  };

  const formatValue = (value: string | number | boolean, type: string) => {
    if (type === "checkbox") {
      return value ? "✓ Yes" : "✗ No";
    }
    if (type === "date" && typeof value === "string") {
      return new Date(value).toLocaleDateString();
    }
    return value.toString();
  };

  return (
    <>
      <div
        style={{ backgroundColor: "hsl(var(--color-card))" }}
        className="rounded-lg p-4 shadow-elevation-card hover:shadow-elevation-card-hover transition-shadow duration-200"
      >
        {/* Title at the top */}
        <h3 className="text-xl font-bold mb-4 pb-3 border-b" style={{ borderColor: "hsl(var(--color-border))" }}>
          {machine.title}
        </h3>

        <div className="space-y-2">
          {machineType.attributes.filter(attr => attr.id !== 'title').map((attr) => (
            <div
              key={attr.id}
              className="flex justify-between items-start gap-2"
            >
              <span
                style={{ color: "hsl(var(--color-muted-foreground))" }}
                className="font-medium"
              >
                {attr.name}:
              </span>
              <span className="text-right">
                {formatValue(machine.values[attr.id] ?? "", attr.type)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4 pt-4">
          <button
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: "hsl(var(--color-primary))",
              color: "hsl(var(--color-primary-foreground))",
            }}
            className="flex-1 px-3 py-2 rounded transition hover:opacity-90"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "hsl(var(--color-destructive))",
              color: "hsl(var(--color-destructive-foreground))",
            }}
            className="flex-1 px-3 py-2 rounded transition hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
      {isEditing && (
        <MachineFormModal
          machineType={machineType}
          machine={machine}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
