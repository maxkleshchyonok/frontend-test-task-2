import { Machine, MachineType } from "@/types";

/**
 * Format a value for display as a title
 */
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

/**
 * Check if a value is considered "empty" for title purposes
 */
function isEmptyValue(value: string | number | boolean | undefined | null): boolean {
  // Undefined or null are always empty
  if (value === undefined || value === null) {
    return true;
  }
  // For boolean, check if it's explicitly set (true or false are both valid)
  // This is already handled above - if we reach here, boolean is set
  if (typeof value === "boolean") {
    return false;
  }
  // For string, check if it's empty after trimming
  if (typeof value === "string") {
    return value.trim() === "";
  }
  // For number, consider it non-empty (including 0)
  return false;
}

export function getMachineTitle(
  machine: Machine,
  machineType: MachineType
): string {
  if (!machineType.titleAttributeId) {
    // Fallback: try to use the first attribute's value if available
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

  // Fallback: try to use the first attribute's value if the title attribute has no value
  if (machineType.attributes.length > 0) {
    const firstAttrValue = machine.values[machineType.attributes[0].id];
    if (!isEmptyValue(firstAttrValue)) {
      return formatTitleValue(firstAttrValue as string | number | boolean);
    }
  }

  return "Untitled";
}
