import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Machine } from '@/types';

interface MachinesState {
  machines: Machine[];
}

const loadState = (): Machine[] => {
  if (typeof window === 'undefined') return [];
  try {
    const serializedState = localStorage.getItem('machines');
    if (serializedState === null) return [];
    const machines = JSON.parse(serializedState) as Machine[];
    return machines.map((machine) => ({
      ...machine,
      title: machine.title ?? 'Untitled'
    }));
  } catch {
    return [];
  }
};

const saveState = (machines: Machine[]) => {
  if (typeof window === 'undefined') return;
  try {
    const serializedState = JSON.stringify(machines);
    localStorage.setItem('machines', serializedState);
  } catch {
    // Ignore write errors
  }
};

const initialState: MachinesState = {
  machines: loadState(),
};

export const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    addMachine: (state, action: PayloadAction<Machine>) => {
      state.machines.push(action.payload);
      saveState(state.machines);
    },
    updateMachine: (state, action: PayloadAction<Machine>) => {
      const index = state.machines.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.machines[index] = action.payload;
        saveState(state.machines);
      }
    },
    deleteMachine: (state, action: PayloadAction<string>) => {
      state.machines = state.machines.filter(m => m.id !== action.payload);
      saveState(state.machines);
    },
    deleteMachinesByType: (state, action: PayloadAction<string>) => {
      state.machines = state.machines.filter(m => m.typeId !== action.payload);
      saveState(state.machines);
    },
  },
});

export const { addMachine, updateMachine, deleteMachine, deleteMachinesByType } = machinesSlice.actions;
export default machinesSlice.reducer;
