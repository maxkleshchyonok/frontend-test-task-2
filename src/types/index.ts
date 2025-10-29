export type AttributeType = 'text' | 'number' | 'date' | 'checkbox';

export interface Attribute {
  id: string;
  name: string;
  type: AttributeType;
}

export type TitleConfig = 
  | { type: 'manual' } // User enters title manually
  | { type: 'linked'; attributeId: string }; // Title is linked to another text field

export interface MachineType {
  id: string;
  title: string; // Required and unique - this is the "Machine Type" field
  attributes: Attribute[];
  titleConfig: TitleConfig; // Configuration for how the "Machine Title" field works
}

export interface Machine {
  id: string;
  typeId: string;
  title: string; // Every machine must have a title
  values: Record<string, string | number | boolean>;
}
