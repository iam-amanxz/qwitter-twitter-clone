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
import { AnimatePresence, motion } from 'framer-motion';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import { followUser } from '../store/userSlice';
import { showToast } from '../utils';

const SideBar = () => {
  console.log('SIDEBAR RENDERED');
  const { baseTheme } = useTheme();
  const { currentUser } = useSelector((state) => state.auth);
  const { users, isLoading } = useSelector((state) => state.users);
  const [usersToFollow, setUsersToFollow] = useState(null);

  useEffect(() => {
    if (currentUser && users.length > 0) {
      console.log(currentUser);
      console.log(users);
      setUsersToFollow(
        users.filter(
          (user) =>
            !user.followers.includes(currentUser.username) &&
            user.username !== currentUser.username,
        ),
      );
    }
  }, [currentUser, users]);

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

      {!isLoading && usersToFollow && usersToFollow.length === 0 && (
        <Text
          mt={4}
          fontSize={'sm'}
          fontWeight={'medium'}
          color={baseTheme.textSecondaryColor}
        >
          No more users to follow
        </Text>
      )}

      <AnimatePresence>
        {usersToFollow &&
          usersToFollow.length > 0 &&
          usersToFollow
            .slice(0, 5)
            .map((user) => <UserDetail user={user} key={user.username} />)}
      </AnimatePresence>

      {usersToFollow && usersToFollow.length > 5 && (
        <Link to={`/${currentUser.username}/explore/to_follow`}>
          <Text mt={4} fontSize={'sm'} color={'blue.500'} fontWeight={'medium'}>
            Show more
          </Text>
        </Link>
      )}
    </Box>
  );
};

const UserDetail = memo(
  ({ user }) => {
    console.log('USER DETAIL RENDERED - SIDEBAR');
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
    };

    const MotionFlex = motion(Flex);

    return (
      <MotionFlex
        initial={{ opacity: 0, rotateX: 30 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, rotateX: 30 }}
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
      </MotionFlex>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  },
);

export default SideBar;
