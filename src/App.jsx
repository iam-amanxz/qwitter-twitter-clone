import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth, db } from './firebase';
import { useDispatch } from 'react-redux';
import {
  resetAuthState,
  setCurrentUser,
  setAuthenticated,
} from './store/authSlice';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthPage from './routes/AuthPage';
import HomePage from './routes/HomePage';
import PrivateRoute from './routes/PrivateRoute';
import { listenToUsers } from './store/userSlice';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { listenToPosts } from './store/postSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // this will every time the auth state changes
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
        localStorage.removeItem('authenticated');
        dispatch(resetAuthState());
      }
    });

    return () => sub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

    let unsubscribe;
    if (isAuthenticated) {
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        dispatch(listenToUsers(users));
      });
    }

    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    let unsubscribe;
    if (isAuthenticated) {
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        dispatch(listenToPosts(posts));
      });
    }

    return () => unsubscribe();
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
