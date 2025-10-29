import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MachineType } from "@/types";
import { cleanupToken } from "@/utils/filterToken";

interface MachineTypesState {
  types: MachineType[];
}

const loadState = (): MachineType[] => {
  if (typeof window === "undefined") return [];
  try {
    const serializedState = localStorage.getItem("machineTypes");
    if (serializedState === null) return [];
    const types = JSON.parse(serializedState) as Array<Record<string, unknown>>;

    return types.map((type) => {
      if ("titleConfig" in type) {
        const titleConfig = type.titleConfig as
          | { type: string; attributeId?: string }
          | undefined;
        const titleAttributeId =
          titleConfig?.type === "linked" ? titleConfig.attributeId : undefined;

        return {
          id: String(type.id),
          name: String(type.title || type.name || "Unnamed"),
          attributes: (type.attributes as MachineType["attributes"]) || [],
          titleAttributeId,
        };
      }

      return {
        id: String(type.id),
        name: String(type.name || type.title || "Unnamed"),
        attributes: (type.attributes as MachineType["attributes"]) || [],
        titleAttributeId: type.titleAttributeId as string | undefined,
      };
    });
  } catch {
    return [];
  }
};

const saveState = (types: MachineType[]) => {
  if (typeof window === "undefined") return;
  try {
    const serializedState = JSON.stringify(types);
    localStorage.setItem("machineTypes", serializedState);
  } catch {
    // Ignore write errors
  }
};

const initialState: MachineTypesState = {
  types: loadState(),
};

export const machineTypesSlice = createSlice({
  name: "machineTypes",
  initialState,
  reducers: {
    addMachineType: (state, action: PayloadAction<MachineType>) => {
      state.types.push(action.payload);
      saveState(state.types);
    },
    updateMachineType: (state, action: PayloadAction<MachineType>) => {
      const index = state.types.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.types[index] = action.payload;
        saveState(state.types);
      }
    },
    deleteMachineType: (state, action: PayloadAction<string>) => {
      const typeId = action.payload;
      state.types = state.types.filter((t) => t.id !== typeId);
      saveState(state.types);

      cleanupToken(typeId);
    },
  },
});

export const { addMachineType, updateMachineType, deleteMachineType } =
  machineTypesSlice.actions;
export default machineTypesSlice.reducer;
