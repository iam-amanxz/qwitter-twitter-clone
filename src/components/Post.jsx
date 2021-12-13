import {
  Avatar,
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const Post = ({ post }) => {
  dayjs.extend(relativeTime);
  const { baseTheme } = useTheme();

  const formatDate = (date) => {
    return dayjs(date).fromNow();
  };

  return (
    <Flex
      p={3}
      m={3}
      borderBottomWidth={'1px'}
      borderColor={baseTheme.borderColor}
    >
      <Link to="">
        <Avatar name="Aman" size="md" mr={3} />
      </Link>

      <Flex flexGrow={1} flexDir={'column'}>
        {/* Post */}
        <Box mb={2}>
          <Link to="">
            <Heading size="sm" color={baseTheme.textPrimaryColor} mb={1}>
              Aman
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
            alignItems={'center'}
            cursor={'pointer'}
            p={1}
            borderRadius={'full'}
            _hover={{ backgroundColor: baseTheme.backgroundHoverColor }}
          >
            <FiHeart color={baseTheme.textSecondaryColor} />
            <Text fontSize={'xs'} ml={1} color={baseTheme.textSecondaryColor}>
              {post?.likes.length}
            </Text>
          </Flex>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default Post;
