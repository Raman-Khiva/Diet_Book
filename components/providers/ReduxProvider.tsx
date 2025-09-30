'use client';

import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from '@/lib/redux/store';
import { selectUser } from '@/lib/redux/slices/authSlice';
import { fetchFoodItemsByUser } from '@/lib/redux/slices/foodlogSlice';
import { useAppDispatch } from '@/lib/redux/hooks';

function StoreInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchFoodItemsByUser({ uid: user.uid }));
    }
  }, [dispatch, user?.uid]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreInitializer>{children}</StoreInitializer>
    </Provider>
  );
}
