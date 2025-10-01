import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;

}

const emptyUser: User ={
  uid : "",
  email : "",
  displayName : "",
  photoURL : "",
}

interface AuthState {
  isAuthed : boolean;  
  user: User;
  token: string | null;
  loading: boolean;
  error: string | null;
}
const initialState: AuthState = {
  isAuthed : false,
  user: emptyUser,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      logout : (state) => {
        state.isAuthed = false;
        state.user = emptyUser;
        state.token = null;
        state.loading = false;
        state.error = null;
      },
      emailLinkSignIn: (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isAuthed = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      }

    },
});

export const { logout , emailLinkSignIn } = authSlice.actions;
export const selectAuth    =  (state : RootState) => state.auth;
export const selectToken   =  (state : RootState) => state.auth.token;
export const selectAuthLoading =  (state : RootState) => state.auth.loading; 
export const selectError   =  (state : RootState) => state.auth.error;
export const selectIsAuthed = (state : RootState) => state.auth.isAuthed;
export const selectUser    =  (state : RootState) => state.auth.user;
export default authSlice.reducer;

