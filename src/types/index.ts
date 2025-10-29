export type AttributeType = "text" | "number" | "date" | "checkbox";

export interface Attribute {
  id: string;
  name: string;
  type: AttributeType;
}

export type TitleConfig =
  | { type: "manual" }
  | { type: "linked"; attributeId: string };

export interface MachineType {
  id: string;
  title: string;
  attributes: Attribute[];
  titleConfig: TitleConfig;
}

export interface Machine {
  id: string;
  typeId: string;
  title: string;
  values: Record<string, string | number | boolean>;
}
