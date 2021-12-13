import { useDispatch } from 'react-redux';
import MainLayout from '../layout/MainLayout';
import SideNav from '../components/SideNav';

const HomePage = () => {
  return (
    <MainLayout
      left={<SideNav />}
      center={<div>Center</div>}
      right={<div>Right</div>}
    />
  );
};

export default HomePage;
