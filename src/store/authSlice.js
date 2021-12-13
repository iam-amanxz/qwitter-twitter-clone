import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
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
  currentUser: [],
  isAuthenticated: JSON.parse(localStorage.getItem('authenticated')),
  error: null,
  isLoading: null,
};

export const setCurrentUser = createAsyncThunk(
  'setCurrentUser',
  async (req, thunkAPI) => {
    const uid = auth.currentUser.uid;

    const userRef = doc(db, 'users', uid);

    try {
      const docSnap = await getDoc(userRef);
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const register = createAsyncThunk('register', async (user, thunkAPI) => {
  if (user.username.length < 3) {
    return thunkAPI.rejectWithValue('Username must be at least 3 characters');
  }
  // check if username is taken
  const q = query(
    collection(db, 'users'),
    where('username', '==', user.username),
  );

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      return thunkAPI.rejectWithValue('Username is taken');
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }

  // register user
  try {
    await createUserWithEmailAndPassword(auth, user.email, user.password);
  } catch (error) {
    switch (error.message) {
      case 'Firebase: Error (auth/invalid-email).':
        return thunkAPI.rejectWithValue('Invalid email address');
      case 'Firebase: Password should be at least 6 characters (auth/weak-password).':
        return thunkAPI.rejectWithValue(
          'Password must be at least 6 characters',
        );
      case 'Firebase: Error (auth/email-already-in-use).':
        return thunkAPI.rejectWithValue('User already exists with this email');
      default:
        return thunkAPI.rejectWithValue('Something went wrong');
    }
  }

  delete user.password;

  // save user in database
  try {
    await setDoc(doc(db, 'users', auth.currentUser.uid), user);
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue('Register unsuccessful!');
  }
});

export const login = createAsyncThunk('login', async (req, thunkAPI) => {
  const { email, password } = req;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error.message);
    switch (error.message) {
      case 'Firebase: Error (auth/invalid-email).':
        return thunkAPI.rejectWithValue('Invalid email address');
      case 'Firebase: Error (auth/user-not-found).':
        return thunkAPI.rejectWithValue('Invalid credentials');
      case 'Firebase: Error (auth/wrong-password).':
        return thunkAPI.rejectWithValue('Invalid credentials');
      default:
        return thunkAPI.rejectWithValue('Something went wrong');
    }
  }
});

export const logout = createAsyncThunk('logout', async (req, thunkAPI) => {
  try {
    await signOut(auth);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(setCurrentUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(setCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(setCurrentUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(register.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      // current user will be set from onAuthStateChanged
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      // current user will be set from onAuthStateChanged
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(logout.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = null;
      // current user will be set from onAuthStateChanged
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
