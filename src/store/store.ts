import { configureStore } from '@reduxjs/toolkit';
import machineTypesReducer from './slices/machineTypesSlice';
import machinesReducer from './slices/machinesSlice';

export const store = configureStore({
  reducer: {
    machineTypes: machineTypesReducer,
    machines: machinesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
