import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const initialState = {
  users: [],
  error: null,
  isLoading: true,
};

export const listenToUsers = createAsyncThunk(
  'listenToUsers',
  async (req, thunkAPI) => {
    console.log('listening to users...');
    return req;
  },
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(listenToUsers.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(listenToUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.isLoading = false;
    });
    builder.addCase(listenToUsers.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
