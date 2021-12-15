import { Box, Flex, Center, Heading, Stack, Button } from '@chakra-ui/react';
import { useState } from 'react';

import AuthModal from '../components/AuthModal';
import { useTheme } from '../context/themeContext';

const AuthPage = () => {
  const { baseTheme, accentTheme } = useTheme();

  // const coverImage =
  //   'https://images.unsplash.com/photo-1634334181759-a965220b6a91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1099&q=80';
  const coverImage =
    'https://images.unsplash.com/photo-1547989453-11e67ffb3885?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80';
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
        backgroundColor={baseTheme.backgroundColor}
        flexGrow={1}
        p={10}
        flexDir={'column'}
        alignItems={{ base: 'center', md: 'start' }}
      >
        <Heading size="3xl" mb={14} color={baseTheme.textPrimaryColor}>
          Happening now
        </Heading>
        <Heading size="xl" mb={16} color={baseTheme.textPrimaryColor}>
          Join Qwitter today.
        </Heading>

        <Stack spacing={4}>
          <Button
            color={accentTheme.textColor}
            backgroundColor={accentTheme.accentColor}
            _hover={{ backgroundColor: accentTheme.accentHoverColor }}
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
            color={accentTheme.accentColor}
            borderColor={accentTheme.accentColor}
            _hover={{
              backgroundColor: accentTheme.accentHoverColor,
              color: accentTheme.textColor,
            }}
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
