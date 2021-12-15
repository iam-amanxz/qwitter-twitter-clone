import {
  Box,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SideBar from '../components/SideBar';
import SideNav from '../components/SideNav';
import MainLayout from '../layout/MainLayout';
import { FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '../context/themeContext';
import { useSelector } from 'react-redux';
import UserDetail from '../components/UserDetail';
import { useEffect, useState } from 'react';

const renderCenter = () => {
  const { username } = useParams();
  const { users } = useSelector((state) => state.users);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (users.length > 0) {
      setUser(users.find((user) => user.username === username));
    }
  }, [users, username]);

  return (
    <Box>
      <ExploreHeader user={user} />
      <ExploreTabs />
    </Box>
  );
};

const ExplorePage = () => {
  return (
    <MainLayout
      left={<SideNav />}
      center={renderCenter()}
      right={<SideBar />}
    />
  );
};

const ExploreTabs = () => {
  const navigate = useNavigate();
  const { tabIndex, username } = useParams();
  const { baseTheme, accentTheme } = useTheme();
  const { users } = useSelector((state) => state.users);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [notFollowing, setNotFollowing] = useState([]);

  useEffect(() => {
    if (users.length > 0) {
      if (users.find((user) => user.username === username) === undefined) {
        console.log('USER NOT FOUND');
      }
      setNotFollowing(
        users.filter(
          (user) =>
            !user.followers.includes(username) && user.username !== username,
        ),
      );
      setFollowing(users.filter((user) => user.followers.includes(username)));
      setFollowers(users.filter((user) => user.following.includes(username)));
    }
  }, [users, username]);

  const renderEmpty = (message) => (
    <Box p={6} textAlign={'center'}>
      <Text fontWeight={'medium'} color={baseTheme.textSecondaryColor}>
        {message}
      </Text>
    </Box>
  );

  return (
    <Tabs
      isLazy
      index={tabIndex === 'to_follow' ? 0 : tabIndex === 'followers' ? 1 : 2}
    >
      <TabList
        color={baseTheme.textPrimaryColor}
        borderColor={baseTheme.borderColor}
        borderBottomWidth={'1px'}
        justifyContent={'space-between'}
      >
        <Tab
          onClick={() => {
            navigate(`/${username}/explore/to_follow`);
          }}
          flexGrow={1}
          fontWeight={'semibold'}
          _selected={{
            borderBottomWidth: '3px',
            borderColor: accentTheme.accentColor,
            boxShadow: 'none',
          }}
        >
          Who to follow
        </Tab>

        <Tab
          onClick={() => {
            navigate(`/${username}/explore/followers`);
          }}
          flexGrow={1}
          fontWeight={'semibold'}
          _selected={{
            borderBottomWidth: '3px',
            borderColor: accentTheme.accentColor,
            boxShadow: 'none',
          }}
        >
          Followers
        </Tab>

        <Tab
          onClick={() => {
            navigate(`/${username}/explore/following`);
          }}
          flexGrow={1}
          fontWeight={'semibold'}
          _selected={{
            borderBottomWidth: '3px',
            borderColor: accentTheme.accentColor,
            boxShadow: 'none',
          }}
        >
          Following
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          {notFollowing.length > 0
            ? notFollowing.map((user) => (
                <UserDetail key={user.id} user={user} />
              ))
            : renderEmpty('You are following everyone!')}
        </TabPanel>
        <TabPanel>
          {followers.length > 0
            ? followers.map((user) => <UserDetail key={user.id} user={user} />)
            : renderEmpty('You have no followers!')}
        </TabPanel>
        <TabPanel>
          {following.length > 0
            ? following.map((user) => <UserDetail key={user.id} user={user} />)
            : renderEmpty('You are not following anyone!')}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

const ExploreHeader = ({ user }) => {
  const { baseTheme } = useTheme();
  return (
    <Flex
      backgroundColor={baseTheme.backgroundColor}
      zIndex={100}
      position={'sticky'}
      top={0}
      p={3}
      alignItems={'center'}
      borderBottomWidth={'1px'}
      borderColor={baseTheme.borderColor}
    >
      <Link to="/">
        <FiArrowLeft size={'1.4em'} color={baseTheme.textSecondaryColor} />
      </Link>
      <Box ml={4}>
        <Heading size="base" color={baseTheme.textPrimaryColor}>
          {user?.name}
        </Heading>
      </Box>
    </Flex>
  );
};

export default ExplorePage;
