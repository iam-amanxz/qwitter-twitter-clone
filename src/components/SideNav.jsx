import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  FiHome,
  FiUser,
  FiHash,
  FiPower,
  FiEdit,
  FiFeather,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import LogoutModal from './LogoutModal';
import ThemeModal from './ThemeModal';

const NavButton = ({ icon, title, ...props }) => {
  const [isLg] = useMediaQuery('(min-width: 992px)');
  const { baseTheme } = useTheme();

  return (
    <Button
      backgroundColor={baseTheme.backgroundColor}
      _hover={{ backgroundColor: baseTheme.backgroundHoverColor }}
      color={baseTheme.textPrimaryColor}
      w={'max'}
      px={isLg && 3}
      borderRadius={'full'}
      iconSpacing={isLg && 3}
      leftIcon={icon}
      {...props}
    >
      {isLg && title}
    </Button>
  );
};

const UserHeader = () => {
  const { baseTheme } = useTheme();
  const [isLg] = useMediaQuery('(min-width: 992px)');
  const { currentUser } = useSelector((state) => state.auth);

  return (
    <Link to="">
      <Flex mb={5} alignItems={'center'}>
        <Avatar
          src={currentUser?.profilePicUrl && currentUser.profilePicUrl}
          name={currentUser?.name}
          size="md"
          mr={isLg && 3}
        />
        {isLg && (
          <Box>
            <Heading size="sm" color={baseTheme.textPrimaryColor}>
              {currentUser?.name}
            </Heading>
            <Text fontSize="xs" color={baseTheme.textSecondaryColor}>
              @{currentUser?.username}
            </Text>
          </Box>
        )}
      </Flex>
    </Link>
  );
};

const SideNav = () => {
  const { baseTheme, setBaseTheme, accentTheme, setAccentTheme, themes } =
    useTheme();
  const [isLg] = useMediaQuery('(min-width: 992px)');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const links = [
    { icon: <FiHome fontSize={'1.3em'} />, title: 'Home' },
    { icon: <FiHash fontSize={'1.3em'} />, title: 'Explore' },
    {
      icon: <FiEdit fontSize={'1.3em'} />,
      title: 'Theme',
      onClick: () => setIsThemeModalOpen(true),
    },
    { icon: <FiUser fontSize={'1.3em'} />, title: 'Profile' },
    {
      icon: <FiPower fontSize={'1.3em'} />,
      title: 'Logout',
      onClick: () => setIsLogoutModalOpen(true),
    },
  ];

  return (
    <Box pt={4} position={'sticky'} top={0}>
      <UserHeader />
      {/* Links */}
      <Stack direction="column" spacing={5}>
        {links.map(({ icon, title, onClick }, index) => (
          <NavButton icon={icon} title={title} onClick={onClick} key={index} />
        ))}

        <Button
          h={'40px'}
          w={isLg ? '80%' : '40px'}
          leftIcon={!isLg && <FiFeather size="1.4em" />}
          borderRadius={'full'}
          backgroundColor={accentTheme.accentColor}
          _hover={{ backgroundColor: accentTheme.accentHoverColor }}
          color={'white'}
          iconSpacing={0}
        >
          {isLg && 'Tweet'}
        </Button>
      </Stack>

      <ThemeModal
        isThemeModalOpen={isThemeModalOpen}
        setIsThemeModalOpen={setIsThemeModalOpen}
      />
      <LogoutModal
        isLogoutModalOpen={isLogoutModalOpen}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
      />
    </Box>
  );
};

export default SideNav;
