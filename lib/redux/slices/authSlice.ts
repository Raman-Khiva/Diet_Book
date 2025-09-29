import { GoogleAuthProvider, signInWithPopup, type User } from 'firebase/auth';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { auth } from '../../firebase';

export const googleRegister = createAsyncThunk<
  { user: User; token: string },
  void,
  { rejectValue: { error: string } }
>(
  'auth/googleRegister',
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      if (!res) {
        return rejectWithValue({ error: 'Google Sign In failed' });
      }

      const token = await res.user.getIdToken();
      console.warn("Token :",token );
      console.warn("User : ",res.user);
      console.warn("email : ",res.user.email);
      console.warn("name : ",res.user.displayName);
      console.warn("uid : ",res.user.uid);
      return { user: res.user, token };
    } catch (error) {
      return rejectWithValue({ error: 'Google Sign In failed' });
    }
  }
);

interface AuthState {
  
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.error = null;
            state.loading = true;
        },
        loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
            state.loading = false;
        },
        loginFailure(state, action: PayloadAction<string | null>) {
            state.error = action.payload ?? null;
            state.loading = false;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
        },
        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload;
        },
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(googleRegister.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleRegister.fulfilled, (state, action) => {
                state.loading = false;
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

export const { loginStart, loginSuccess, loginFailure, logout, setToken, setUser } = authSlice.actions;

export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;
export const selectLoading = (state: AuthState) => state.loading;
export const selectError = (state: AuthState) => state.error;



export default authSlice.reducer;

