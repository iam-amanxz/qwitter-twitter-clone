import {
  Avatar,
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../utils';
import { likePost, unlikePost } from '../store/postSlice';
import { motion } from 'framer-motion';
import PostOptionMenu from './PostOptionMenu';
import DeletePostConfirmModal from './DeletePostConfirmModal';

dayjs.extend(relativeTime);

const Post = memo(
  ({ post }) => {
    console.log('Post');
    const { baseTheme } = useTheme();
    const { users } = useSelector((state) => state.users);
    const { currentUser } = useSelector((state) => state.auth);
    const toast = useToast();
    const dispatch = useDispatch();
    const [isSm] = useMediaQuery('(min-width: 480px)');
    const owner = users.find((user) => user.username === post.owner);

    const formatDate = (date) => {
      return dayjs(date).fromNow();
    };

    const handleLikeUnlike = async () => {
      if (post?.likes.includes(currentUser?.username)) {
        const res = await dispatch(
          unlikePost({ postId: post.id, username: currentUser?.username }),
        );

        if (res.error) {
          showToast(toast, {
            status: 'error',
            description: res.error,
          });
          return;
        }
      } else {
        const res = await dispatch(
          likePost({ postId: post.id, username: currentUser?.username }),
        );

        if (res.error) {
          showToast(toast, {
            status: 'error',
            description: res.error,
          });
          return;
        }
      }
    };

    const MotionFlex = motion(Flex);

    return (
      <MotionFlex
        initial={{ opacity: 0, rotateX: 30 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, rotateX: 30 }}
        p={3}
        m={3}
        borderBottomWidth={'1px'}
        borderColor={baseTheme.borderColor}
      >
        <Link to={`/${owner?.username}`}>
          <Avatar
            name={owner?.name}
            size={isSm ? 'md' : 'sm'}
            mr={3}
            src={owner?.profilePicUrl && owner.profilePicUrl}
          />
        </Link>

        <Flex flexGrow={1} flexDir={'column'}>
          {/* Post */}
          <Box mb={2}>
            <Link to={`/${owner?.username}`}>
              <Heading size="sm" color={baseTheme.textPrimaryColor} mb={1}>
                {owner?.name || '[Deleted User]'}
                <Text
                  ml={1}
                  fontWeight={'normal'}
                  display={'inline-block'}
                  fontSize="xs"
                  color={baseTheme.textSecondaryColor}
                >
                  @{post.owner} • {formatDate(post?.createdAt)}
                </Text>
              </Heading>
            </Link>
            <Text fontSize={'sm'} color={baseTheme.textPrimaryColor}>
              {post?.body}
            </Text>

            {post?.imageUrl && (
              <Image
                src={post.imageUrl}
                w={'full'}
                maxH={'xs'}
                borderRadius={'lg'}
                mt={4}
                fit={'cover'}
              />
            )}
          </Box>

          {/* Likes */}
          <Stack direction={'row'}>
            <Flex
              onClick={handleLikeUnlike}
              alignItems={'center'}
              cursor={'pointer'}
              p={1}
              borderRadius={'full'}
              _hover={{ backgroundColor: baseTheme.backgroundHoverColor }}
            >
              {post?.likes.includes(currentUser?.username) ? (
                <FaHeart color={'red'} />
              ) : (
                <FiHeart color={baseTheme.textSecondaryColor} />
              )}
              <Text fontSize={'xs'} ml={1} color={baseTheme.textSecondaryColor}>
                {post?.likes.length}
              </Text>
            </Flex>
          </Stack>
        </Flex>

        {currentUser?.username === post.owner && <PostOptionMenu post={post} />}
      </MotionFlex>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.post === nextProps.post;
  },
);

export default Post;
