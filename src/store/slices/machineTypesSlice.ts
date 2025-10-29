import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MachineType } from '@/types';
import { cleanupToken } from '@/utils/filterToken';

interface MachineTypesState {
  types: MachineType[];
}

const loadState = (): MachineType[] => {
  if (typeof window === 'undefined') return [];
  try {
    const serializedState = localStorage.getItem('machineTypes');
    if (serializedState === null) return [];
    const types = JSON.parse(serializedState) as MachineType[];
    // Migrate old data to include titleConfig
    return types.map((type) => ({
      ...type,
      titleConfig: type.titleConfig ?? { type: 'manual' as const }
    }));
  } catch {
    return [];
  }
};

const saveState = (types: MachineType[]) => {
  if (typeof window === 'undefined') return;
  try {
    const serializedState = JSON.stringify(types);
    localStorage.setItem('machineTypes', serializedState);
  } catch {
    // Ignore write errors
  }
};

const initialState: MachineTypesState = {
  types: loadState(),
};

export const machineTypesSlice = createSlice({
  name: 'machineTypes',
  initialState,
  reducers: {
    addMachineType: (state, action: PayloadAction<MachineType>) => {
      state.types.push(action.payload);
      saveState(state.types);
    },
    updateMachineType: (state, action: PayloadAction<MachineType>) => {
      const index = state.types.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.types[index] = action.payload;
        saveState(state.types);
      }
    },
    deleteMachineType: (state, action: PayloadAction<string>) => {
      const typeId = action.payload;
      state.types = state.types.filter(t => t.id !== typeId);
      saveState(state.types);
      // Clean up the filter token for this type
      cleanupToken(typeId);
    },
  },
});

export const { addMachineType, updateMachineType, deleteMachineType } = machineTypesSlice.actions;
export default machineTypesSlice.reducer;
