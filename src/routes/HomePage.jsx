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

const HomePostsList = () => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const { baseTheme } = useTheme();

  if (isLoading) {
    return (
      <Box>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el, index) => (
          <Stack direction={'row'} p={5} key={index}>
            <SkeletonCircle size={'20'} mr={3} flexShrink={0} />
            <SkeletonText width={'full'} />
          </Stack>
        ))}
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box p={10} textAlign={'center'}>
        <Heading size={'md'} mb={1}>
          Woah! Such Empty.
        </Heading>
        <Text fontWeight={'medium'} color={baseTheme.textSecondaryColor}>
          No posts found! Tweet something or follow a user to view the posts.
        </Text>
      </Box>
    );
  }

  return posts.map((post) => <Post key={post.id} post={post} />);
};

const renderCenter = () => {
  return (
    <Box>
      <HomeHeader />
      <HomePostsList />
    </Box>
  );
};

const HomePage = () => {
  return (
    <MainLayout
      left={<SideNav />}
      center={renderCenter()}
      right={<SideBar />}
    />
  );
};

export default HomePage;
