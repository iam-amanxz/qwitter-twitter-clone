import { Box, Flex, Center, Heading, Stack, Button } from '@chakra-ui/react';
import { useState } from 'react';

import AuthModal from '../components/AuthModal';
import { useTheme } from '../context/themeContext';

const AuthPage = () => {
  const { themes } = useTheme();

  // const coverImage =
  //   'https://images.unsplash.com/photo-1634334181759-a965220b6a91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1099&q=80';
  const coverImage =
    'https://images.unsplash.com/photo-1492573637402-25691cd9eac2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUpActive, setIsSignUpActive] = useState(true);

  return (
    <Flex h={'100vh'}>
      <Box
        backgroundPosition={'right'}
        backgroundSize={'cover'}
        backgroundImage={`url(${coverImage})`}
        display={{ base: 'none', lg: 'block' }}
        w={{ lg: '50%', xl: '55%' }}
      />

      <Center
        backgroundColor={themes.auth.background}
        flexGrow={1}
        p={10}
        flexDir={'column'}
        alignItems={{ base: 'center', md: 'start' }}
      >
        <Heading size="3xl" mb={14} color={themes.auth.textPrimary}>
          Happening now
        </Heading>
        <Heading size="xl" mb={16} color={themes.auth.textPrimary}>
          Join Qwitter today.
        </Heading>

        <Stack spacing={4}>
          <Button
            color={themes.auth.textSecondary}
            backgroundColor={themes.auth.accent}
            _hover={{ backgroundColor: themes.auth.accentHover }}
            px={12}
            borderRadius={'full'}
            onClick={() => {
              setIsAuthModalOpen(true);
              setIsSignUpActive(true);
            }}
          >
            Sign up with email
          </Button>
          <Button
            color={themes.auth.accent}
            borderColor={themes.auth.accent}
            _hover={{ backgroundColor: themes.auth.backgroundHover }}
            px={12}
            borderRadius={'full'}
            variant="outline"
            onClick={() => {
              setIsAuthModalOpen(true);
              setIsSignUpActive(false);
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Center>

      <AuthModal
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        isSignUpActive={isSignUpActive}
      />
    </Flex>
  );
};

export default AuthPage;
