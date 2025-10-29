export type AttributeType = "text" | "number" | "date" | "checkbox";

export interface Attribute {
  id: string;
  name: string;
  type: AttributeType;
}

export interface MachineType {
  id: string;
  name: string;
  attributes: Attribute[];
  titleAttributeId?: string; // ID of the attribute to use as title, undefined if no title
}

export interface Machine {
  id: string;
  typeId: string;
  values: Record<string, string | number | boolean>;
}
