import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '../context/themeContext';

const PostOptionMenu = ({ setOpenDeleteConfirmDialog }) => {
  const handleInitiateDelete = () => {
    setOpenDeleteConfirmDialog(true);
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
          Delete Post
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default PostOptionMenu;
