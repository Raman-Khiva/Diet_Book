import { createSlice, PayloadAction, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, deleteDoc, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { RootState } from '../store';


export const addFoodItem = createAsyncThunk<
  {newItem : FoodItem},
  { uid: string; itemName: string; unit: string,refAmt: number ,calories: number ,protein: number },
  { rejectValue: string }
>('foodlog/addFoodItem', async ({ uid, itemName, unit,refAmt,calories,protein }, { rejectWithValue }) => {
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
        unit : unit,
        refAmt : refAmt,
        calories : calories,
        protein : protein,
        calPerUnit : calories / refAmt,
        proteinPerUnit : protein / refAmt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

      },
      { merge: true }
    );

    console.log('[foodlog/addFoodItem] Successfully added item', { uid, itemName: trimmedName });
    const newItem : FoodItem = {       
        name: trimmedName,
        id : trimmedName,
        unit : unit,
        refAmt : refAmt,
        calories : calories,
        protein : protein,
        calPerUnit : calories / refAmt,
        proteinPerUnit : protein / refAmt,

    }
    return {newItem}
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

interface DateEntry{
    foodItemId : string,
    date : string,
    amount : number
}


export const addDateToFoodItem = createAsyncThunk<
    {addedDateEntry : DateEntry},
    { uid: string; foodItemId: string; date: string; amount: number },
    {rejectValue : string}
    >(
      'foodlog/addDateToFoodItem',
      async ({uid, foodItemId,date,amount},{rejectWithValue}) =>{
            try{

              const dateRef = doc(db,'users',uid, 'foodItems',foodItemId,'dates',date);
              await setDoc(dateRef,{
                date : date,
                amount : amount
              },{merge: true});
              const addedDateEntry : DateEntry = {foodItemId, date, amount};
              return {
                addedDateEntry : addedDateEntry
              };
            }catch(err){
              return rejectWithValue(
                "Error while adding log to foodItem"
              )
            }
      }
    )








export type FoodItem = {
  id: string;
  name: string;
  unit: string;
  refAmt: number;
  calPerUnit : number;
  proteinPerUnit : number;
  calories: number;
  protein: number;
};



export interface FoodLogState {
  foodItems: FoodItem[];
  dateEntries: DateEntry[];
  loading: boolean;
  error: string | null;
}


const initialState: FoodLogState = {
  foodItems: [],
  dateEntries : [],
  loading: false,
  error: null,
};


export const fetchFoodItemsByUser = createAsyncThunk<
  { foodItems: FoodItem[],dateEntries : DateEntry[] },
  { uid: string },
  { rejectValue: string }
>(
  'foodlog/fetchFoodItemsByUser',
  async ( {uid} , { rejectWithValue }) => {
    try {
      console.log('[foodlog/fetchFoodItemsByUser] Fetching items for user', { uid });
      const foodItemsRef = collection(db, 'users', uid, 'foodItems');
      const querySnapshot = await getDocs(foodItemsRef);
      if (querySnapshot.empty) {
        console.warn('[foodlog/fetchFoodItemsByUser] No food items found for user', { uid });
        const foodItems : FoodItem[] = [];
        const dateEntries : DateEntry[] = []
        return { foodItems: foodItems, dateEntries : dateEntries };
      }
      const foodItems : FoodItem[] = querySnapshot
                                         .docs.map(doc => ({
                                           id: doc.id,  
                                           name: doc.data().name,
                                           unit: doc.data().unit,
                                           refAmt: doc.data().refAmt,
                                           calPerUnit : doc.data().calPerUnit,
                                           proteinPerUnit : doc.data().proteinPerUnit,
                                           calories: doc.data().calories,
                                           protein: doc.data().protein
                                         }));
      console.log('[foodlog/fetchFoodItemsByUser] Retrieved food items', {
        count: foodItems.length,
        ids: foodItems.map(item => item.id),
      });
      const dateEntries : DateEntry[] = [];

      for(const foodItem of foodItems){
        const dateEntriesRef = collection(db,'users',uid,'foodItems',foodItem.id,'dates');
        const querySnapshot = await getDocs(dateEntriesRef);
        dateEntries.push(...querySnapshot.docs.map(doc => ({foodItemId: foodItem.id, date: doc.id, amount: doc.data().amount })));
      }
      return {
        foodItems,
        dateEntries
      };
    } catch (error) {
      console.error('[foodlog/fetchFoodItemsByUser] Failed to fetch items', error);
      const message = 'Failed to fetch food items.';
      return rejectWithValue(message);
    }
  }
);





const foodlogSlice = createSlice({
  name: 'foodlog',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodItemsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodItemsByUser.fulfilled, (state, action) => {
        state.foodItems= action.payload.foodItems;
        state.dateEntries = action.payload.dateEntries;
        state.loading = false;
        
        state.error = null;
      })
      .addCase(fetchFoodItemsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to load food items.';
      })

      .addCase(addFoodItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFoodItem.fulfilled, (state, action) => {
        state.loading = false;
        state.foodItems.push(action.payload.newItem);
      })
      .addCase(addFoodItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to add food item.';
      })

      .addCase(addDateToFoodItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDateToFoodItem.fulfilled, (state, action) => {
        state.loading = false;
        state.dateEntries.push(action.payload.addedDateEntry);
      })
      .addCase(addDateToFoodItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to add date to food item.';
      })
  },
});



export const selectFoodItems = (state: RootState) => state.foodlog.foodItems;
export const selectFoodLogLoading = (state: RootState) => state.foodlog.loading;
export const selectDateEntries = (state: RootState) => state.foodlog.dateEntries;


export default foodlogSlice.reducer;
