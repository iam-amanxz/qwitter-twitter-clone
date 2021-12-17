import {
  Box,
  Button,
  Circle,
  Flex,
  Image,
  Square,
  Stack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  FiEdit,
  FiFeather,
  FiHash,
  FiHome,
  FiPower,
  FiUser,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import { userSelector } from '../store/userSlice';
import LogoutModal from './LogoutModal';
import ThemeModal from './ThemeModal';
import TweetModal from './TweetModal';

const NavButton = ({ icon, ...props }) => {
  const { baseTheme } = useTheme();

  return (
    <Square size={'30px'}>
      <Button
        backgroundColor={baseTheme.backgroundColor}
        _hover={{ backgroundColor: baseTheme.backgroundColor }}
        color={baseTheme.textPrimaryColor}
        leftIcon={icon}
        iconSpacing={0}
        {...props}
      ></Button>
    </Square>
  );
};

const MobileNav = () => {
  const { baseTheme, accentTheme } = useTheme();
  const [isSm] = useMediaQuery('(min-width: 480px)');
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);

  const UserAvatar = () => (
    <Circle
      size={'6'}
      overflow={'hidden'}
      borderWidth={'2px'}
      borderColor={baseTheme.textPrimaryColor}
    >
      <Image
        src={user?.profilePicUrl && user.profilePicUrl}
        alt={user?.name}
        height={'100%'}
        objectFit={'cover'}
      />
    </Circle>
  );

  const primaryLinks = [
    {
      icon: <FiHome fontSize={'1.3em'} />,
      onClick: () => navigate('/'),
    },
    {
      icon: <FiHash fontSize={'1.3em'} />,
      onClick: () => navigate(`/${user.username}/explore/to_follow`),
    },
    {
      icon: <FiEdit fontSize={'1.3em'} />,
      onClick: () => setIsThemeModalOpen(true),
    },
    {
      icon: <FiPower fontSize={'1.3em'} />,
      onClick: () => setIsLogoutModalOpen(true),
    },
    {
      icon: <UserAvatar />,
      onClick: () => navigate(`/${user.username}`),
    },
  ];

  return (
    <Box
      borderTopWidth={'1px'}
      borderColor={baseTheme.borderColor}
      display={isSm && 'none'}
      position={'fixed'}
      bottom={0}
      left={0}
      w={'full'}
      backgroundColor={baseTheme.backgroundColor}
    >
      <Stack direction={'row'} justifyContent={'space-around'} p={3}>
        {primaryLinks.map(({ icon, onClick }, index) => (
          <NavButton icon={icon} onClick={onClick} key={index} />
        ))}
      </Stack>

      <Circle
        cursor={'pointer'}
        position={'absolute'}
        p={4}
        bottom={20}
        right={5}
        backgroundColor={accentTheme.accentColor}
        onClick={() => setIsTweetModalOpen(true)}
      >
        <FiFeather size="1.7em" color={accentTheme.textColor} />
      </Circle>

      {/* Extra */}
      <LogoutModal
        isLogoutModalOpen={isLogoutModalOpen}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
      />
      <TweetModal
        isTweetModalOpen={isTweetModalOpen}
        setIsTweetModalOpen={setIsTweetModalOpen}
      />
      <ThemeModal
        isThemeModalOpen={isThemeModalOpen}
        setIsThemeModalOpen={setIsThemeModalOpen}
      />
    </Box>
  );
};

export default MobileNav;
