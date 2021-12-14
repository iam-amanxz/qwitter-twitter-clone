import { async } from '@firebase/util';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const initialState = {
  users: [],
  error: null,
  isLoading: false,
};

export const fetchUsers = createAsyncThunk(
  'fetchUsers',
  async (req, thunkAPI) => {
    console.log('FETCHING USERS...');
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

    try {
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return users;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const followUser = createAsyncThunk(
  'followUser',
  async ({ userId, targetId, username, targetName }, thunkAPI) => {
    const userRef = doc(db, 'users', userId);
    const targetRef = doc(db, 'users', targetId);

    try {
      await updateDoc(userRef, {
        following: arrayUnion(targetName),
      });
      await updateDoc(targetRef, {
        followers: arrayUnion(username),
      });
      return { targetId, username };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const unfollowUser = createAsyncThunk(
  'unfollowUser',
  async ({ userId, targetId, username, targetName }, thunkAPI) => {
    try {
      const userRef = doc(db, 'users', userId);
      const targetRef = doc(db, 'users', targetId);
      await updateDoc(userRef, {
        following: arrayRemove(targetName),
      });
      await updateDoc(targetRef, {
        followers: arrayRemove(username),
      });
      return { userId, targetId, username, targetName };
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });

    // ---------------------------------------------/

    builder.addCase(followUser.pending, (state, action) => {
      // state.isLoading = true;
    });
    builder.addCase(followUser.fulfilled, (state, action) => {
      // state.users = state.users.map((user) => {
      //   if (user.id === action.payload.targetId) {
      //     user.following.push(action.payload.username);
      //   }
      //   return user;
      // });
      // state.isLoading = false;
    });
    builder.addCase(followUser.rejected, (state, action) => {
      state.error = action.error;
      // state.isLoading = false;
    });

    builder.addCase(unfollowUser.pending, (state, action) => {
      // state.isLoading = true;
    });
    builder.addCase(unfollowUser.fulfilled, (state, action) => {
      // state.users = state.users.map((user) => {
      //   if (user.id === action.payload.targetId) {
      //     user.following = user.following.filter(
      //       (following) => following !== action.payload.username,
      //     );
      //   }
      //   return user;
      // });
      // state.isLoading = false;
    });
    builder.addCase(unfollowUser.rejected, (state, action) => {
      state.error = action.error;
      // state.isLoading = false;
    });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;

// builder.addCase(listenToUsers.pending, (state, action) => {
//   state.isLoading = true;
// });
// builder.addCase(listenToUsers.fulfilled, (state, action) => {
//   state.users = action.payload;
//   state.isLoading = false;
// });
// builder.addCase(listenToUsers.rejected, (state, action) => {
//   state.error = action.error;
//   state.isLoading = false;
// });

// export const listenToUsers = createAsyncThunk(
//   'listenToUsers',
//   async (req, thunkAPI) => {
//     console.log('listening to users...');
//     return req;
//   },
// );
