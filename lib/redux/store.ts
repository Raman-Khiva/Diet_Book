import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import foodlogReducer from './slices/foodlogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    foodlog: foodlogReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  // devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
