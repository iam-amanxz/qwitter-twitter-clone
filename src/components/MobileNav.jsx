import {
  Box,
  Button,
  Circle,
  Image,
  Square,
  Stack,
  useMediaQuery,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiFeather } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import { userSelector } from '../store/userSlice';
import LogoutModal from './LogoutModal';
import ThemeModal from './ThemeModal';
import TweetModal from './TweetModal';
import { useNav } from '../context/navContext';
import {
  RiUser3Line,
  RiUser3Fill,
  RiHome3Line,
  RiHome3Fill,
  RiSearch2Fill,
  RiSearch2Line,
  RiBrushFill,
  RiBrushLine,
  RiLogoutCircleLine,
  RiLogoutCircleFill,
} from 'react-icons/ri';

const NavButton = ({ icon, iconActive, title, ...props }) => {
  const { baseTheme } = useTheme();
  const { activeNav } = useNav();

  return (
    <Square size={'30px'}>
      <Button
        isActive={title === activeNav}
        _active={{
          bg: baseTheme.backgroundColor,
        }}
        backgroundColor={baseTheme.backgroundColor}
        _hover={{ backgroundColor: baseTheme.backgroundColor }}
        color={baseTheme.textPrimaryColor}
        leftIcon={title !== activeNav ? icon : iconActive}
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
  const { setActiveNav } = useNav();

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
      icon: <RiHome3Line fontSize={'1.3em'} />,
      iconActive: <RiHome3Fill fontSize={'1.3em'} />,
      title: 'Home',
      onClick: () => {
        navigate(`/`);
        setActiveNav('Home');
      },
    },
    {
      icon: <RiSearch2Line fontSize={'1.3em'} />,
      iconActive: <RiSearch2Fill fontSize={'1.3em'} />,
      title: 'Explore',
      onClick: () => {
        navigate(`/${user.username}/explore/to_follow`);
        setActiveNav('Explore');
      },
    },
    {
      icon: <RiBrushLine fontSize={'1.3em'} />,
      iconActive: <RiBrushFill fontSize={'1.3em'} />,
      title: 'Theme',
      onClick: () => {
        setIsThemeModalOpen(true);
        setActiveNav('Theme');
      },
    },
    {
      icon: <RiLogoutCircleLine fontSize={'1.3em'} />,
      iconActive: <RiLogoutCircleFill fontSize={'1.3em'} />,
      title: 'Logout',
      onClick: () => {
        setIsLogoutModalOpen(true);
        setActiveNav('Logout');
      },
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
        {primaryLinks.map(({ title, icon, iconActive, onClick }, index) => (
          <NavButton
            title={title}
            icon={icon}
            onClick={onClick}
            key={index}
            iconActive={iconActive}
          />
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
