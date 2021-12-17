import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import { followUser, unfollowUser } from '../store/userSlice';
import { showToast } from '../utils';

const UserDetail = memo(
  ({ user }) => {
    console.log('USER DETAIL RENDERED - EXPLORE');
    const { currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { baseTheme } = useTheme();
    const toast = useToast();
    const [isSm] = useMediaQuery('(min-width: 480px)');

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
      <Flex
        pb={2}
        mb={5}
        alignItems={'center'}
        borderBottomWidth={'1px'}
        borderColor={'whiteAlpha.300'}
      >
        <Box alignSelf={'flex-start'}>
          <Link to={`/${user.username}`}>
            <Avatar
              src={user.profilePicUrl && user.profilePicUrl}
              size={isSm ? 'md' : 'sm'}
              mr={3}
              name={user.name}
            />
          </Link>
        </Box>

        <Box flexGrow={1}>
          <Link to={`/${user.username}`}>
            <Flex justifyContent={'space-between'} w={'full'}>
              <Box>
                <Heading size="xs" color={baseTheme.textPrimaryColor} mr={1}>
                  {user.name}
                </Heading>
                <Text fontSize="xs" color={baseTheme.textSecondaryColor}>
                  @{user.username}
                </Text>
              </Box>

              {user.username !== currentUser?.username && (
                <Button
                  flexShrink={0}
                  onClick={handleFollowUnfollow}
                  backgroundColor={baseTheme.contrastBtnBgColor}
                  color={baseTheme.contrastBtnTextColor}
                  _hover={{
                    backgroundColor: baseTheme.contrastBtnBgHoverColor,
                  }}
                  size="xs"
                >
                  {user.followers.includes(currentUser?.username)
                    ? 'Unfollow'
                    : 'Follow'}
                </Button>
              )}
            </Flex>

            {user.bio && (
              <Text fontSize={'sm'} color={baseTheme.textPrimaryColor}>
                {user.bio}
              </Text>
            )}
          </Link>
        </Box>
      </Flex>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.user === nextProps.user;
  },
);

export default UserDetail;
