import { Machine, MachineType } from "@/types";

function formatTitleValue(value: string | number | boolean): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return String(value);
}

function isEmptyValue(
  value: string | number | boolean | undefined | null
): boolean {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "boolean") {
    return false;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  return false;
}

export function getMachineTitle(
  machine: Machine,
  machineType: MachineType
): string {
  if (!machineType.titleAttributeId) {
    if (machineType.attributes.length > 0) {
      const firstAttrValue = machine.values[machineType.attributes[0].id];
      if (!isEmptyValue(firstAttrValue)) {
        return formatTitleValue(firstAttrValue as string | number | boolean);
      }
    }
    return "Untitled";
  }

  const titleValue = machine.values[machineType.titleAttributeId];

  if (!isEmptyValue(titleValue)) {
    return formatTitleValue(titleValue as string | number | boolean);
  }

  if (machineType.attributes.length > 0) {
    const firstAttrValue = machine.values[machineType.attributes[0].id];
    if (!isEmptyValue(firstAttrValue)) {
      return formatTitleValue(firstAttrValue as string | number | boolean);
    }
  }

  return "Untitled";
}
