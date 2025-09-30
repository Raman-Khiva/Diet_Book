import { createSlice, PayloadAction, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, deleteDoc, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export const addFoodItem = createAsyncThunk<
  void,
  { uid: string; itemName: string },
  { rejectValue: string }
>('foodlog/addFoodItem', async ({ uid, itemName }, { rejectWithValue }) => {
  try {
    const trimmedName = itemName.trim();
    console.log('[foodlog/addFoodItem] Attempting to add item', { uid, itemName: trimmedName });
    if (!uid) {
      return rejectWithValue('Unable to determine user. Please sign in again.');
    }
    if (!trimmedName) {
      return rejectWithValue('Food name cannot be empty.');
    }

    const itemRef = doc(db, 'users', uid, 'foodItems', trimmedName);
    await setDoc(
      itemRef,
      {
        name: trimmedName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log('[foodlog/addFoodItem] Successfully added item', { uid, itemName: trimmedName });
  } catch (error) {
    console.error('[foodlog/addFoodItem] Failed to add item', error);
    const message =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message: string }).message)
        : 'Failed to add food item.';
    return rejectWithValue(message);
  }
});

export const addFoodItemEntry = createAsyncThunk<
  { itemName: string; date: string; amount: number },
  { uid: string; itemName: string; date: string; amount: number },
  { rejectValue: string }
>('foodlog/addFoodItemEntry', async ({ uid, itemName, date, amount }, { rejectWithValue }) => {
  try {
    const trimmedName = itemName.trim();
    console.log('[foodlog/addFoodItemEntry] Updating entry', { uid, itemName: trimmedName, date, amount });
    if (!uid) {
      return rejectWithValue('Unable to determine user. Please sign in again.');
    }
    if (!trimmedName) {
      return rejectWithValue('Food item identifier missing.');
    }
    if (!date) {
      return rejectWithValue('Date is required.');
    }

    const entryRef = doc(db, 'users', uid, 'foodItems', trimmedName, 'entries', date);

    if (amount > 0) {
      await setDoc(
        entryRef,
        {
          amount,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      console.log('[foodlog/addFoodItemEntry] Entry saved', { uid, itemName: trimmedName, date, amount });
    } else {
      await deleteDoc(entryRef);
      console.log('[foodlog/addFoodItemEntry] Entry removed', { uid, itemName: trimmedName, date });
    }

    return { itemName: trimmedName, date, amount };
  } catch (error) {
    console.error('[foodlog/addFoodItemEntry] Failed to update entry', error);
    const message =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message: string }).message)
        : 'Failed to update food log entry.';
    return rejectWithValue(message);
  }
});




export type FoodEntry = {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  date: string; // ISO date string (yyyy-mm-dd)
};

export interface FoodLogState {
  entries: FoodEntry[];
  itemEntries: Record<string, Record<string, number>>;
  loading: boolean;
  error: string | null;
}

const initialState: FoodLogState = {
  entries: [],
  itemEntries: {},
  loading: false,
  error: null,
};
export const fetchFoodItemsByUser = createAsyncThunk<
  { items: FoodEntry[]; itemEntries: Record<string, Record<string, number>> },
  { uid: string },
  { rejectValue: string }
>(
  'foodlog/fetchFoodItemsByUser',
  async ({ uid }, { rejectWithValue }) => {
    try {
      console.log('[foodlog/fetchFoodItemsByUser] Fetching items for user', { uid });
      const snapshot = await getDocs(collection(db, 'users', uid, 'foodItems'));
      console.log('[foodlog/fetchFoodItemsByUser] Retrieved documents', { count: snapshot.docs.length });

      const itemEntries: Record<string, Record<string, number>> = {};

      const items = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const defaultDate = new Date().toISOString().slice(0, 10);

          const entriesSnapshot = await getDocs(collection(docSnap.ref, 'entries'));
          if (!entriesSnapshot.empty) {
            const entryMap: Record<string, number> = {};
            entriesSnapshot.forEach((entryDoc) => {
              const entryData = entryDoc.data();
              if (entryData && typeof entryData.amount === 'number') {
                entryMap[entryDoc.id] = entryData.amount;
              }
            });
            if (Object.keys(entryMap).length > 0) {
              itemEntries[docSnap.id] = entryMap;
            }
          }

          return {
            id: docSnap.id,
            name: data.name ?? 'Unknown item',
            calories: Number(data.calories) || 0,
            protein: data.protein !== undefined ? Number(data.protein) : undefined,
            date: typeof data.date === 'string' ? data.date : defaultDate,
          } satisfies FoodEntry;
        })
      );

      const sorted = items.sort((a, b) => (a.date < b.date ? 1 : -1));
      console.log('[foodlog/fetchFoodItemsByUser] Returning sorted items', {
        items: sorted.length,
        entriesTracked: Object.keys(itemEntries).length,
      });
      return { items: sorted, itemEntries };
    } catch (error) {
      console.error('[foodlog/fetchFoodItemsByUser] Failed to fetch items', error);
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: string }).message)
          : 'Failed to load food items.';
      return rejectWithValue(message);
    }
  }
);

export const addFoodItemForUser = createAsyncThunk<
  FoodEntry,
  { uid: string; item: Omit<FoodEntry, 'id'> },
  { rejectValue: string }
>('foodlog/addFoodItemForUser', async ({ uid, item }, { rejectWithValue }) => {
  try {
    console.log('[foodlog/addFoodItemForUser] Adding item for user', { uid, name: item.name });
    const itemsCollectionRef = collection(db, 'users', uid, 'foodItems');
    const docRef = doc(itemsCollectionRef);
    const payload = {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload, { merge: true });

    const created = {
      id: docRef.id,
      ...item,
    } satisfies FoodEntry;
    console.log('[foodlog/addFoodItemForUser] Item added', { uid, id: created.id });
    return created;
  } catch (error) {
    console.error('[foodlog/addFoodItemForUser] Failed to add item', error);
    const message =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message: string }).message)
        : 'Failed to add food item.';
    return rejectWithValue(message);
  }
});

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodItemsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodItemsByUser.fulfilled, (state, action) => {
        state.entries = action.payload.items;
        state.itemEntries = action.payload.itemEntries;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFoodItemsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load food items.';
      })
      .addCase(addFoodItemForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFoodItemForUser.fulfilled, (state, action) => {
        state.entries.unshift(action.payload);
        state.loading = false;
      })
      .addCase(addFoodItemForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to add food item.';
      })
      .addCase(addFoodItemEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(addFoodItemEntry.fulfilled, (state, action) => {
        const { itemName, date, amount } = action.payload;
        if (!state.itemEntries[itemName]) {
          state.itemEntries[itemName] = {};
        }
        if (amount > 0) {
          state.itemEntries[itemName][date] = amount;
        } else if (state.itemEntries[itemName]) {
          delete state.itemEntries[itemName][date];
        }
      })
      .addCase(addFoodItemEntry.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to update food log entry.';
      });
  },
});

export const { addEntry, updateEntry, removeEntry, clearEntries, setEntries } = foodlogSlice.actions;


export const selectFoodItems = (state: FoodLogState) => state.entries;
export const selectFoodItemEntries = (state: FoodLogState) => state.itemEntries;
export const selectFoodItemEntry = (state: FoodLogState, itemName: string, date: string) => state.itemEntries[itemName]?.[date] || 0;
export const selectLoading = (state: FoodLogState) => state.loading;



export default foodlogSlice.reducer;
