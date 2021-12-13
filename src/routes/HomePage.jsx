import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <div>Home Page</div>
      <button
        onClick={() => {
          dispatch(logout());
        }}
      >
        Signout
      </button>
    </div>
  );
};

export default HomePage;
