
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "../../firebase";


const googleRegister = createAsyncThunk(
    "auth/googleRegister",
    async (_,{rejectWithValue}) =>{
        try {
          const provider = new GoogleAuthProvider();
          const res = await signInWithPopup(auth, provider);
          if(!res){
            return rejectWithValue({
                error : "Google Sign In failed",
            })
          }
          const user = res.user;
          const token = await user.getIdToken();
          
          return{
            user : user,
            token : token,
          } 
                
        } catch(err){
            rejectWithValue({
                error : "Google Sign In failed",
            })
        }
    }
)












const initialState = {
    user: null,
    token: null,
    loading : false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.error = null;
        },
        loginSuccess(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
        },
        loginFailure(state, action) {
            state.error = action.payload;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
        },
        setToken(state, action) {
            state.token = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, setToken, setUser } = authSlice.actions;

export default authSlice.reducer;

