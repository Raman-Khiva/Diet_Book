import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export type FoodEntry = {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  date: string; // ISO date string (yyyy-mm-dd)
  notes?: string;
};

export interface FoodLogState {
  entries: FoodEntry[];
}

const initialState: FoodLogState = {
  entries: [],
};

const foodlogSlice = createSlice({
  name: 'foodlog',
  initialState,
  reducers: {
    addEntry: {
      reducer(state: FoodLogState, action: PayloadAction<FoodEntry>) {
        state.entries.unshift(action.payload);
      },
      prepare(entry: Omit<FoodEntry, 'id'> & { id?: string }) {
        return {
          payload: {
            id: entry.id ?? nanoid(),
            ...entry,
          },
        };
      },
    },
    updateEntry(state: FoodLogState, action: PayloadAction<FoodEntry>) {
      const idx = state.entries.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.entries[idx] = action.payload;
    },
    removeEntry(state: FoodLogState, action: PayloadAction<string>) {
      state.entries = state.entries.filter((e) => e.id !== action.payload);
    },
    clearEntries(state: FoodLogState) {
      state.entries = [];
    },
    setEntries(state: FoodLogState, action: PayloadAction<FoodEntry[]>) {
      state.entries = action.payload.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    },
  },
});

export const { addEntry, updateEntry, removeEntry, clearEntries, setEntries } = foodlogSlice.actions;

export default foodlogSlice.reducer;
