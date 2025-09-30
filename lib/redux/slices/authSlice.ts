import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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

export const googleRegister = createAsyncThunk<
  { user: User; token: string },
  void,
  { rejectValue: { error: string } }
>(
  'auth/googleRegister',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[auth/googleRegister] Starting Google sign-in flow');
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      if (!res) {
        console.error('[auth/googleRegister] Sign-in popup returned no result');
        return rejectWithValue({ error: 'Google Sign In failed' });
      }

      const token = await res.user.getIdToken();

      const user: User ={
        uid : res.user.uid,
        email : res.user.email,
        displayName : res.user.displayName,
        photoURL : res.user.photoURL        
      }
      console.log('[auth/googleRegister] Sign-in success', { user : user});
      return { user: user, token: token };
    } catch (error) {
      console.error('[auth/googleRegister] Sign-in failed', error);
      return rejectWithValue({ error: 'Google Sign In failed' });
    }
  }
);

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
      }
    },
    extraReducers: (builder) => {
        builder
            .addCase(googleRegister.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleRegister.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthed = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(googleRegister.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error ?? action.error.message ?? 'Google Sign In failed';
            });
    },
});

export const { logout } = authSlice.actions;
export const selectAuth    =  (state : RootState) => state.auth;
export const selectToken   =  (state : RootState) => state.auth.token;
export const selectLoading =  (state : RootState) => state.auth.loading; 
export const selectError   =  (state : RootState) => state.auth.error;
export const selectIsAuthed = (state : RootState) => state.auth.isAuthed;
export const selectUser    =  (state : RootState) => state.auth.user;


export default authSlice.reducer;

