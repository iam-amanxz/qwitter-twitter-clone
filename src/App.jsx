import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth, db } from './firebase';
import { useDispatch } from 'react-redux';
import {
  resetAuthState,
  setCurrentUser,
  setAuthenticated,
} from './store/authSlice';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AuthPage from './routes/AuthPage';
import HomePage from './routes/HomePage';
import NotFoundPage from './routes/NotFoundPage';
import PrivateRoute from './routes/PrivateRoute';
import {
  addUser,
  modifyUser,
  removeUser,
  resetUserState,
} from './store/userSlice';
import {
  addPost,
  resetPostState,
  removePost,
  modifyPost,
} from './store/postSlice';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import ExplorePage from './routes/ExplorePage';
import ProfilePage from './routes/ProfilePage';
import AuthRoute from './routes/AuthRoute';

function App() {
  const dispatch = useDispatch();

  // Auth listener
  useEffect(() => {
    const sub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // if user is logged in set the current user
        dispatch(setAuthenticated(true));
        dispatch(setCurrentUser());
        localStorage.setItem('authenticated', true);
      } else {
        dispatch(setAuthenticated(false));
        // if user is logged out reset the auth state
        dispatch(resetAuthState());
        // dispatch(resetUserState());
        // dispatch(resetPostState());
        localStorage.removeItem('authenticated');
      }
    });

    return () => sub();
  }, []);

  // Users listener
  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    let unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          dispatch(
            addUser({
              id: change.doc.id,
              ...change.doc.data(),
            }),
          );
          console.log('NEW USER: ', change.doc.data());
        }
        if (change.type === 'modified') {
          console.log('MODIFIED USER: ', change.doc.data());
          dispatch(modifyUser({ id: change.doc.id, ...change.doc.data() }));
        }
        if (change.type === 'removed') {
          console.log('REMOVED USER: ', change.doc.data());
          dispatch(removeUser(change.doc.id));
        }
      });
    });
    return () => unsubscribe();
  }, []);

  // Posts listener
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    let unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          dispatch(
            addPost({
              id: change.doc.id,
              ...change.doc.data(),
            }),
          );
          console.log('NEW POST: ', change.doc.data());
        }
        if (change.type === 'modified') {
          console.log('MODIFIED POST: ', change.doc.data());
          dispatch(modifyPost({ id: change.doc.id, ...change.doc.data() }));
        }
        if (change.type === 'removed') {
          console.log('REMOVED POST: ', change.doc.data());
          dispatch(removePost(change.doc.id));
        }
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <AuthPage />
            </AuthRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/:username/explore/:tabIndex"
          element={
            <PrivateRoute>
              <ExplorePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/:username"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
