import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/themeContext';

const UserDetail = ({ user }) => {
  const { baseTheme } = useTheme();

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
          <Heading
            size="sm"
            color={'whiteAlpha.900'}
            color={baseTheme.textPrimaryColor}
          >
            {user.name}
          </Heading>
          <Text
            fontSize="sm"
            color={'whiteAlpha.900'}
            color={baseTheme.textSecondaryColor}
          >
            @{user.username}
          </Text>
        </Link>
      </Box>

      <Button
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
  const { users, isLoading } = useSelector((state) => state.users);

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
      {users.length > 0 &&
        users.map((user) => <UserDetail user={user} key={user.username} />)}
    </Box>
  );
};

export default SideBar;
