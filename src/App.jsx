import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import {
  login,
  logout,
  resetAuthState,
  setCurrentUser,
  setAuthenticated,
} from './store/authSlice';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthPage from './routes/AuthPage';
import HomePage from './routes/HomePage';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  const dispatch = useDispatch();

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

  const renderRoutes = () => (
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

  return renderRoutes();
  // return (
  //   <div>
  //     <button
  //       onClick={async () => {
  //         dispatch(
  //           login({ email: 'iam.amanxz@gmail.com', password: 'test123#' }),
  //         );
  //       }}
  //     >
  //       SignIn
  //     </button>
  //     <button
  //       onClick={async () => {
  //         dispatch(logout());
  //       }}
  //     >
  //       Signout
  //     </button>
  //   </div>
  // );
}

export default App;
