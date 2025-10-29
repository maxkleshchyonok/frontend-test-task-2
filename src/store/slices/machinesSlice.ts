import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Machine } from "@/types";

interface MachinesState {
  machines: Machine[];
}

const loadState = (): Machine[] => {
  if (typeof window === "undefined") return [];
  try {
    const serializedState = localStorage.getItem("machines");
    if (serializedState === null) return [];
    const machines = JSON.parse(serializedState) as Array<
      Record<string, unknown>
    >;

    // Migrate old data structure to new one (remove title property)
    return machines.map((machine) => ({
      id: String(machine.id),
      typeId: String(machine.typeId),
      values: (machine.values as Machine["values"]) || {},
    }));
  } catch {
    return [];
  }
};

const saveState = (machines: Machine[]) => {
  if (typeof window === "undefined") return;
  try {
    const serializedState = JSON.stringify(machines);
    localStorage.setItem("machines", serializedState);
  } catch {
    // Ignore write errors
  }
};

const initialState: MachinesState = {
  machines: loadState(),
};

export const machinesSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    addMachine: (state, action: PayloadAction<Machine>) => {
      state.machines.push(action.payload);
      saveState(state.machines);
    },
    updateMachine: (state, action: PayloadAction<Machine>) => {
      const index = state.machines.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.machines[index] = action.payload;
        saveState(state.machines);
      }
    },
    deleteMachine: (state, action: PayloadAction<string>) => {
      state.machines = state.machines.filter((m) => m.id !== action.payload);
      saveState(state.machines);
    },
    deleteMachinesByType: (state, action: PayloadAction<string>) => {
      state.machines = state.machines.filter(
        (m) => m.typeId !== action.payload
      );
      saveState(state.machines);
    },
    syncMachinesWithTypeChange: (
      state,
      action: PayloadAction<{
        typeId: string;
        oldTitleAttributeId?: string;
        newTitleAttributeId?: string;
        removedAttributeIds?: string[];
        addedAttributeIds?: string[];
        newTitleAttributeType?: string;
        oldTitleAttributeType?: string;
      }>
    ) => {
      const {
        typeId,
        oldTitleAttributeId,
        newTitleAttributeId,
        removedAttributeIds = [],
        addedAttributeIds = [],
        newTitleAttributeType,
        oldTitleAttributeType,
      } = action.payload;

      if (
        oldTitleAttributeId === newTitleAttributeId &&
        removedAttributeIds.length === 0
      ) {
        return;
      }

      state.machines = state.machines.map((machine) => {
        if (machine.typeId !== typeId) {
          return machine;
        }

        const updatedValues = { ...machine.values };

        removedAttributeIds.forEach((attrId) => {
          delete updatedValues[attrId];
        });

        if (
          oldTitleAttributeId !== newTitleAttributeId &&
          newTitleAttributeId
        ) {
          if (
            oldTitleAttributeId &&
            removedAttributeIds.includes(oldTitleAttributeId)
          ) {
          } else if (oldTitleAttributeId) {
            const oldTitleValue = machine.values[oldTitleAttributeId];
            const newTitleValue = updatedValues[newTitleAttributeId];

            const isNewTitleUnsetCheckbox =
              newTitleAttributeType === "checkbox" &&
              (newTitleValue === undefined || newTitleValue === null);

            if (isNewTitleUnsetCheckbox) {
              delete updatedValues[oldTitleAttributeId];
            } else if (
              !addedAttributeIds.includes(newTitleAttributeId) &&
              oldTitleAttributeType === newTitleAttributeType
            ) {
              const shouldCopy =
                oldTitleValue !== undefined &&
                oldTitleValue !== null &&
                oldTitleValue !== "" &&
                (newTitleValue === undefined ||
                  newTitleValue === null ||
                  newTitleValue === "") &&
                newTitleAttributeType !== "checkbox";

              if (shouldCopy) {
                updatedValues[newTitleAttributeId] = oldTitleValue;
              }
            }
          }
        }

        return {
          ...machine,
          values: updatedValues,
        };
      });

      saveState(state.machines);
    },
  },
});

export const {
  addMachine,
  updateMachine,
  deleteMachine,
  deleteMachinesByType,
  syncMachinesWithTypeChange,
} = machinesSlice.actions;
export default machinesSlice.reducer;
