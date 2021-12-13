import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import postReducer from './postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    posts: postReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
