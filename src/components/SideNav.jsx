import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useMediaQuery,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  FiHome,
  FiUser,
  FiHash,
  FiPower,
  FiEdit,
  FiFeather,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import { userSelector } from '../store/userSlice';
import LogoutModal from './LogoutModal';
import ThemeModal from './ThemeModal';
import TweetModal from './TweetModal';

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
  console.log('USER HEADER RENDERED - SIDE NAV');
  const { baseTheme } = useTheme();
  const [isLg] = useMediaQuery('(min-width: 992px)');
  const { isLoading } = useSelector((state) => state.auth);
  const user = useSelector(userSelector);

  return (
    <Link to="">
      <Flex mb={5} alignItems={'center'}>
        {isLoading ? (
          <SkeletonCircle size={'50px'} mr={isLg && 3} />
        ) : (
          <Avatar
            src={user?.profilePicUrl && user.profilePicUrl}
            name={user?.name}
            size="md"
            mr={isLg && 3}
          />
        )}

        {isLg && !isLoading ? (
          <Box>
            <Heading size="sm" color={baseTheme.textPrimaryColor}>
              {user?.name}
            </Heading>

            <Text fontSize="sm" color={baseTheme.textSecondaryColor}>
              @{user?.username}
            </Text>
          </Box>
        ) : (
          <SkeletonText width={isLg ? '60%' : 'max'} />
        )}
      </Flex>
    </Link>
  );
};

const SideNav = () => {
  const { accentTheme } = useTheme();
  const [isLg] = useMediaQuery('(min-width: 992px)');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const links = [
    {
      icon: <FiHome fontSize={'1.3em'} />,
      title: 'Home',
      onClick: () => navigate(`/`),
    },
    {
      icon: <FiHash fontSize={'1.3em'} />,
      title: 'Explore',
      onClick: () => navigate(`/${currentUser.username}/explore/to_follow`),
    },
    {
      icon: <FiEdit fontSize={'1.3em'} />,
      title: 'Theme',
      onClick: () => setIsThemeModalOpen(true),
    },
    {
      icon: <FiUser fontSize={'1.3em'} />,
      title: 'Profile',
      onClick: () => navigate(`/${currentUser.username}`),
    },
    {
      icon: <FiPower fontSize={'1.3em'} />,
      title: 'Logout',
      onClick: () => setIsLogoutModalOpen(true),
    },
  ];

  return (
    <Box pt={4} position={'sticky'} top={0}>
      <UserHeader />

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
          onClick={() => setIsTweetModalOpen(true)}
        >
          {isLg && 'Qweet'}
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
      <TweetModal
        isTweetModalOpen={isTweetModalOpen}
        setIsTweetModalOpen={setIsTweetModalOpen}
      />
    </Box>
  );
};

export default SideNav;
