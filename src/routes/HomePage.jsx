import MainLayout from '../layout/MainLayout';
import SideNav from '../components/SideNav';
import SideBar from '../components/SideBar';
import {
  Box,
  Heading,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTheme } from '../context/themeContext';
import { useSelector } from 'react-redux';
import Post from '../components/Post';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { userSelector } from '../store/userSlice';

const renderCenter = () => (
  <Box>
    <HomeHeader />
    <HomePostsList />
  </Box>
);

const HomePage = () => {
  return (
    <MainLayout
      left={<SideNav />}
      center={renderCenter()}
      right={<SideBar />}
    />
  );
};

const HomePostsList = () => {
  console.log('HOME POSTS LIST RENDERED');
  const { posts, isLoading } = useSelector((state) => state.posts);
  const { baseTheme } = useTheme();
  const user = useSelector(userSelector);

  const [followingPosts, setFollowingPosts] = useState(null);

  useEffect(() => {
    if (user && posts.length > 0) {
      console.log('USE EFFECT');
      setFollowingPosts(
        posts.filter(
          (post) =>
            post.owner === user.username || user.following.includes(post.owner),
        ),
      );
    }
  }, [user, posts]);

  if (isLoading) {
    return (
      <Box>
        {[1, 2, 3].map((el, index) => (
          <Stack direction={'row'} p={5} key={index}>
            <SkeletonCircle size={'16'} mr={3} flexShrink={0} />
            <SkeletonText width={'full'} />
          </Stack>
        ))}
      </Box>
    );
  }

  if (!isLoading && followingPosts && followingPosts.length === 0) {
    return (
      <Box p={4}>
        <Text fontWeight={'medium'} color={baseTheme.textSecondaryColor}>
          No posts found! Qweet something or follow a user to view posts.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <AnimatePresence>
        {followingPosts &&
          followingPosts.map((post) => <Post key={post.id} post={post} />)}
      </AnimatePresence>
    </Box>
  );
};

const HomeHeader = () => {
  const { baseTheme } = useTheme();

  return (
    <Box
      backgroundColor={baseTheme.backgroundColor}
      zIndex={100}
      position={'sticky'}
      top={0}
      p={3}
      borderBottomWidth={'1px'}
      borderColor={baseTheme.borderColor}
    >
      <Heading size="base" color={baseTheme.textPrimaryColor}>
        Home
      </Heading>
    </Box>
  );
};

export default HomePage;
