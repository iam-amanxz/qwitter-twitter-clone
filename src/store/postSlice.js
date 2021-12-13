import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addDoc,
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
  posts: [],
  error: null,
  isLoading: true,
};

export const listenToPosts = createAsyncThunk(
  'listenToPosts',
  async (req, thunkAPI) => {
    console.log('listening to posts...');
    return req;
  },
);

export const createPost = createAsyncThunk(
  'createPost',
  async (req, thunkAPI) => {
    console.log('creating post...');
    try {
      const post = {
        body: req.body,
        imageUrl: null,
        likes: [],
        owner: req.owner,
        createdAt: new Date().toISOString(),
      };

      const ref = await addDoc(collection(db, 'posts'), post);
      post.id = ref.id;
      return post;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetPostState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(listenToPosts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(listenToPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.isLoading = false;
    });
    builder.addCase(listenToPosts.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(createPost.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
      state.isLoading = false;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
  },
});

export const { resetPostState } = postSlice.actions;
export default postSlice.reducer;
