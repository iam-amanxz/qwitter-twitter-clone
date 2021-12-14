import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db } from '../firebase';

export const uploadPostImage = async (
  storageRef,
  file,
  onUpload,
  onError,
  onComplete,
) => {
  const uploadTask = uploadBytesResumable(storageRef, file);

  await uploadTask.on(
    'state_changed',
    (snapshot) => {
      onUpload((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    },
    (error) => {
      onError(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        onComplete(downloadURL);
      });
    },
  );
};

export const fetchPosts = createAsyncThunk(
  'fetchPosts',
  async (req, thunkAPI) => {
    console.log('FETCHING POSTS...');
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    try {
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return posts;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const createPost = createAsyncThunk(
  'createPost',
  async (req, thunkAPI) => {
    console.log('creating post...');
    try {
      const post = {
        body: req.body,
        imageUrl: req.imageUrl || null,
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

export const likePost = createAsyncThunk(
  'likePost',
  async ({ postId, username }, thunkAPI) => {
    console.log('LIKING POST...');
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayUnion(username),
      });
      return { postId, username };
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const unlikePost = createAsyncThunk(
  'unlikePost',
  async ({ postId, username }, thunkAPI) => {
    console.log('UNLIKING POST...');
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayRemove(username),
      });
      return { postId, username };
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

export const deletePost = createAsyncThunk(
  'deletePost',
  async (postId, thunkAPI) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      return postId;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  },
);

const initialState = {
  posts: [],
  error: null,
  isLoading: true,
};

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.isLoading = false;
    },
    modifyPost: (state, action) => {
      const post = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === post.id);
      state.posts[postIndex] = post;
    },
    removePost: (state, action) => {
      const postId = action.payload;
      const posts = state.posts.filter((post) => post.id !== postId);
      state.posts = posts;
    },
    addPost: (state, action) => {
      const exist = state.posts.find((post) => post.id === action.payload.id);
      if (!exist) {
        state.posts.unshift(action.payload);
        state.isLoading = false;
      }
    },
    resetPostState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createPost.pending, (state, action) => {
      // state.isLoading = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      // state.posts.unshift(action.payload);
      // state.isLoading = false;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.error = action.error;
      // state.isLoading = false;
    });

    // ------------------------------------------------ //

    builder.addCase(likePost.pending, (state, action) => {
      // state.isLoading = true;
    });
    builder.addCase(likePost.fulfilled, (state, action) => {
      // const post = state.posts.find((p) => p.id === action.payload.postId);
      // post.likes.push(action.payload.username);
      // state.isLoading = false;
    });
    builder.addCase(likePost.rejected, (state, action) => {
      state.error = action.error;
      // state.isLoading = false;
    });

    // ------------------------------------------------ //

    builder.addCase(unlikePost.pending, (state, action) => {
      // state.isLoading = true;
    });
    builder.addCase(unlikePost.fulfilled, (state, action) => {
      // const post = state.posts.find((p) => p.id === action.payload.postId);
      // post.likes = post.likes.filter((l) => l !== action.payload.username);
      // state.isLoading = false;
    });
    builder.addCase(unlikePost.rejected, (state, action) => {
      state.error = action.error;
      // state.isLoading = false;
    });

    // ------------------------------------------------ //

    builder.addCase(fetchPosts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });

    // ------------------------------------------------ //

    builder.addCase(deletePost.pending, (state, action) => {
      // state.isLoading = true;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      // state.posts = state.posts.filter((p) => p.id !== action.payload);
      // state.isLoading = false;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.error = action.error;
      // state.isLoading = false;
    });
  },
});

export const { resetPostState, addPost, removePost, modifyPost, setPosts } =
  postSlice.actions;
export default postSlice.reducer;

// builder.addCase(listenToPosts.pending, (state, action) => {
//   state.isLoading = true;
// });
// builder.addCase(listenToPosts.fulfilled, (state, action) => {
//   state.posts = action.payload;
//   state.isLoading = false;
// });
// builder.addCase(listenToPosts.rejected, (state, action) => {
//   state.error = action.error;
//   state.isLoading = false;
// });

// export const listenToPosts = createAsyncThunk(
//   'listenToPosts',
//   async (req, thunkAPI) => {
//     console.log('listening to posts...');
//     return req;
//   },
// );
