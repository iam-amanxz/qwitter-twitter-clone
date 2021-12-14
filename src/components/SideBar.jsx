import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  SkeletonText,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import { followUser } from '../store/userSlice';
import { showToast } from '../utils';

const UserDetail = ({ user }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const { baseTheme } = useTheme();
  const toast = useToast();

  const dispatch = useDispatch();

  const handleFollow = async () => {
    const res = await dispatch(
      followUser({
        userId: currentUser?.id,
        username: currentUser?.username,
        targetId: user?.id,
        targetName: user?.username,
      }),
    );
    console.log(res);

    // if (res.error) {
    //   showToast(toast, {
    //     status: 'error',
    //     description: res.error,
    //   });
    //   return;
    // }
  };

  return (
    <Flex
      pb={3}
      mt={5}
      alignItems={'center'}
      borderBottomWidth={'1px'}
      borderColor={baseTheme.borderColorAlt}
    >
      <Link to={`/${user.username}`}>
        <Avatar
          src={user.profilePicUrl && user.profilePicUrl}
          size="md"
          mr={3}
          name={user.name}
        />
      </Link>

      <Box flexGrow={1}>
        <Link to={`/${user.username}`}>
          <Heading size="sm" color={baseTheme.textPrimaryColor}>
            {user.name}
          </Heading>
          <Text fontSize="sm" color={baseTheme.textSecondaryColor}>
            @{user.username}
          </Text>
        </Link>
      </Box>

      <Button
        onClick={handleFollow}
        backgroundColor={baseTheme.contrastBtnBgColor}
        color={baseTheme.contrastBtnTextColor}
        _hover={{ backgroundColor: baseTheme.contrastBtnBgHoverColor }}
        size="sm"
      >
        Follow
      </Button>
    </Flex>
  );
};

const SideBar = () => {
  const { baseTheme } = useTheme();
  const { currentUser } = useSelector((state) => state.auth);
  const { users, isLoading } = useSelector((state) => state.users);
  const [usersToFollow, setUsersToFollow] = useState([]);

  useEffect(() => {
    if (users) {
      setUsersToFollow(
        users.filter(
          (user) =>
            !user.followers?.includes(currentUser?.username) &&
            user?.username !== currentUser?.username,
        ),
      );
    }
  }, [users, currentUser]);

  return (
    <Box
      m={4}
      p={4}
      borderRadius={'xl'}
      position={'sticky'}
      top={0}
      backgroundColor={baseTheme.backgroundHoverColor}
    >
      <Heading size={'md'} color={baseTheme.textPrimaryColor} mb={4}>
        Who to follow
      </Heading>

      {/* user cards */}
      {isLoading && <SkeletonText w={'full'} />}

      {!isLoading && usersToFollow.length === 0 && <Text>Empty</Text>}

      {usersToFollow.length > 0 &&
        usersToFollow
          .slice(0, 5)
          .map((user) => <UserDetail user={user} key={user.username} />)}
    </Box>
  );
};

export default SideBar;
