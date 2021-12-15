import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from '@chakra-ui/react';
import { FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useTheme } from '../context/themeContext';
import { deletePost } from '../store/postSlice';
import { showToast } from '../utils';

const PostOptionMenu = ({ post }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const handleInitiateDelete = async () => {
    const res = await dispatch(deletePost(post.id));
    if (res.error) {
      showToast(toast, {
        status: 'error',
        description: res.error,
      });
    }
  };
  const { baseTheme } = useTheme();

  return (
    <Menu>
      <MenuButton
        size="sm"
        border="none"
        color={baseTheme.textSecondaryColor}
        borderRadius={'full'}
        _hover={{ bg: baseTheme.backgroundHoverColor }}
        p={0}
        as={IconButton}
        aria-label="Options"
        icon={<FiMoreHorizontal fontSize={'1.3em'} />}
        variant="outline"
      />
      <MenuList
        p={0}
        minW={'min'}
        border={'none'}
        borderRadius={'md'}
        overflow={'hidden'}
      >
        <MenuItem
          shadow={'md'}
          onClick={handleInitiateDelete}
          icon={<FiTrash2 fontSize={'1.3em'} color={'red'} />}
          maxW={'max'}
          fontSize={'smaller'}
          bg={baseTheme.backgroundHoverColor}
          color={baseTheme.textPrimaryColor}
          fontWeight={'semibold'}
          _hover={{ bg: baseTheme.backgroundHoverColor }}
          _focus={{ bg: baseTheme.backgroundHoverColor }}
        >
          Delete Qweet
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default PostOptionMenu;
