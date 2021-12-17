import MainLayout from '../layout/MainLayout';
import SideBar from '../components/SideBar';
import SideNav from '../components/SideNav';
import { useTheme } from '../context/themeContext';
import {
  Avatar,
  Box,
  Button,
  Circle,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { followUser, unfollowUser, userSelector } from '../store/userSlice';
import { AnimatePresence } from 'framer-motion';
import Post from '../components/Post';
import { showToast } from '../utils';
import EditProfileModal from '../components/EditProfileModal';

const ProfilePage = () => {
  return (
    <MainLayout
      left={<SideNav />}
      center={renderCenter()}
      right={<SideBar />}
    />
  );
};

const renderCenter = () => {
  const { username } = useParams();
  const { users } = useSelector((state) => state.users);
  const { posts } = useSelector((state) => state.posts);

  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    if (users.length > 0) {
      setUser(users.find((user) => user.username === username));
      setUserPosts(posts.filter((post) => post.owner === username));
      setLikedPosts(posts.filter((post) => post.likes.includes(username)));
    }
  }, [users, username, posts]);

  return (
    <>
      <ProfileHeader user={user} postsCount={userPosts.length} />
      <ProfileBanner user={user} />
      <ProfileTabs userPosts={userPosts} likedPosts={likedPosts} />
    </>
  );
};

const ProfileBanner = ({ user }) => {
  const { baseTheme } = useTheme();
  const dispatch = useDispatch();
  const toast = useToast();
  const currentUser = useSelector(userSelector);

  const placeholderCoverPic = 'https://wallpaperaccess.com/full/1285952.jpg';
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const handleFollowUnfollow = async () => {
    const following = user.followers.includes(currentUser.username);

    if (!following) {
      const res = await dispatch(
        followUser({
          userId: currentUser?.id,
          username: currentUser?.username,
          targetId: user.id,
          targetName: user.username,
        }),
      );

      if (res.error) {
        showToast(toast, {
          status: 'error',
          description: res.error,
        });
        return;
      }

      showToast(toast, {
        description: `You followed ${user.username}`,
      });
    } else {
      const res = await dispatch(
        unfollowUser({
          userId: currentUser?.id,
          username: currentUser?.username,
          targetId: user.id,
          targetName: user.username,
        }),
      );
      if (res.error) {
        showToast(toast, {
          status: 'error',
          description: res.error,
        });
        return;
      }

      showToast(toast, {
        description: `You unfollowed ${user.username}`,
      });
    }
  };

  return (
    <>
      {/* cover */}
      <Box>
        <Image
          src={user?.coverPicUrl || placeholderCoverPic}
          h={{ base: 32, md: 40 }}
          w={'full'}
          objectFit={'cover'}
        />
      </Box>

      {/* Stats */}
      <Box p={3} position={'relative'}>
        <Circle
          mb={3}
          mt={'-16'}
          size={{ base: '20', md: '24', lg: '28', xl: '32' }}
          overflow={'hidden'}
          borderWidth={'4px'}
          borderColor={baseTheme.backgroundColor}
        >
          <Avatar
            h={'100%'}
            w={'100%'}
            objectFit={'cover'}
            name={user?.name}
            fontSize={'8xl'}
            src={user?.profilePicUrl}
          />
        </Circle>

        <Box>
          <Heading size="sm" color={baseTheme.textPrimaryColor}>
            {user?.name}
          </Heading>
          <Text fontSize="xs" color={baseTheme.textSecondaryColor} mb={2}>
            @{user?.username}
          </Text>
          <Text fontSize="sm" color={baseTheme.textPrimaryColor} mb={1}>
            {user?.bio}
          </Text>
          <Text fontSize="sm" color={baseTheme.textSecondaryColor} mb={2}>
            Joined {dayjs(user?.createdAt).format('MMMM YYYY')}
          </Text>

          <Stack spacing={4} direction={'row'}>
            <Link to={`/${user?.username}/explore/followers`}>
              <Container
                p={0}
                fontSize="sm"
                mb={2}
                color={baseTheme.textSecondaryColor}
              >
                <Container
                  p={0}
                  fontWeight={'bold'}
                  display={'inline'}
                  size="sm"
                  mr={1}
                  color={baseTheme.textPrimaryColor}
                >
                  {user?.followers.length}
                </Container>
                Followers
              </Container>
            </Link>

            <Link to={`/${user?.username}/explore/following`}>
              <Container
                p={0}
                fontSize="sm"
                mb={2}
                color={baseTheme.textSecondaryColor}
              >
                <Container
                  p={0}
                  fontWeight={'bold'}
                  display={'inline'}
                  size="sm"
                  mr={1}
                  color={baseTheme.textPrimaryColor}
                >
                  {user?.following.length}
                </Container>
                Following
              </Container>
            </Link>
          </Stack>
        </Box>

        {user?.id === currentUser?.id && (
          <Button
            size={'sm'}
            color={baseTheme.textPrimaryColor}
            position={'absolute'}
            right={3}
            top={3}
            fontWeight={'normal'}
            borderRadius={'full'}
            borderColor={baseTheme.borderColorAlt}
            variant="outline"
            onClick={() => setIsEditProfileModalOpen(true)}
            _hover={{
              backgroundColor: 'whiteAlpha.100',
            }}
          >
            Edit Profile
          </Button>
        )}

        {/* Follow Unfollow */}
        {user?.id !== currentUser?.id && (
          <Button
            onClick={handleFollowUnfollow}
            size={'sm'}
            color={baseTheme.textPrimaryColor}
            position={'absolute'}
            right={3}
            top={3}
            fontWeight={'normal'}
            borderRadius={'full'}
            borderColor={baseTheme.borderColorAlt}
            variant="outline"
            _hover={{
              backgroundColor: 'whiteAlpha.100',
            }}
          >
            {currentUser?.following.includes(user?.username)
              ? 'Unfollow'
              : 'Follow'}
          </Button>
        )}

        <EditProfileModal
          user={user}
          isEditProfileModalOpen={isEditProfileModalOpen}
          setIsEditProfileModalOpen={setIsEditProfileModalOpen}
        />
      </Box>
    </>
  );
};

const ProfileTabs = ({ userPosts, likedPosts }) => {
  const { baseTheme, accentTheme } = useTheme();

  return (
    <Tabs>
      <TabList
        color={baseTheme.textPrimaryColor}
        borderColor={baseTheme.borderColor}
        borderBottomWidth={'1px'}
        justifyContent={'space-between'}
      >
        <Tab
          flexGrow={1}
          fontWeight={'semibold'}
          _selected={{
            borderBottomWidth: '3px',
            borderColor: accentTheme.accentColor,
            boxShadow: 'none',
          }}
        >
          Qweets
        </Tab>

        <Tab
          flexGrow={1}
          fontWeight={'semibold'}
          _selected={{
            borderBottomWidth: '3px',
            borderColor: accentTheme.accentColor,
            boxShadow: 'none',
          }}
        >
          Likes
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel p={0}>
          <AnimatePresence>
            {userPosts.length > 0 &&
              userPosts.map((post) => <Post key={post.id} post={post} />)}
          </AnimatePresence>
        </TabPanel>
        <TabPanel p={0}>
          <AnimatePresence>
            {likedPosts.length > 0 &&
              likedPosts.map((post) => <Post key={post.id} post={post} />)}
          </AnimatePresence>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

const ProfileHeader = ({ user, postsCount }) => {
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
        <Text color={baseTheme.textSecondaryColor} fontSize={'xs'}>
          {postsCount} Qweets
        </Text>
      </Box>
    </Flex>
  );
};

export default ProfilePage;
