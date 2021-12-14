import {
  createAsyncThunk,
  createDraftSafeSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

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

const initialState = {
  users: [],
  user: null,
  error: null,
  isLoading: false,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      state.isLoading = false;
    },
    addUser: (state, action) => {
      const exist = state.users.find((user) => user.id === action.payload.id);
      if (!exist) {
        state.users.unshift(action.payload);
        state.isLoading = false;
      }
    },
    modifyUser: (state, action) => {
      const user = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === user.id);
      state.users[userIndex] = user;
    },
    removeUser: (state, action) => {
      const userId = action.payload;
      const users = state.users.filter((user) => user.id !== userId);
      state.users = users;
    },
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

export const { resetUserState, addUser, removeUser, modifyUser, setUsers } =
  userSlice.actions;
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

// export const userSelector = (state) =>
//   state.users.find((u) => u.id === auth.currentUser.uid);

// const unsafeSelector = createSelector(selectSelf, (state) => state.value)

const selectSelf = (state) => state;

export const userSelector = createDraftSafeSelector(selectSelf, (state) => {
  const user = state.users.users.find((u) => u.id === auth.currentUser.uid);
  return user;
});
