import { Box, Center, Flex, useMediaQuery } from '@chakra-ui/react';
import MobileNav from '../components/MobileNav';
import { useTheme } from '../context/themeContext';

const MainLayout = ({ left, right, center }) => {
  const { baseTheme } = useTheme();
  const [isSm] = useMediaQuery('(min-width: 480px)');

  return (
    <Box
      w={'100vw'}
      minH={'100vh'}
      px={isSm && 4}
      backgroundColor={baseTheme.backgroundColor}
      position={'relative'}
    >
      <Center mx={'auto'} maxWidth={'1200px'}>
        <Flex flexGrow={1}>
          <Box
            display={{ base: 'none', sm: 'block' }}
            w={{ sm: '10%', lg: '20%' }}
          >
            {left}
          </Box>

          <Box
            borderWidth={'1px'}
            borderColor={baseTheme.borderColor}
            minH={'100vh'}
            w={{ base: '100%', sm: '90%', lg: '50%' }}
          >
            {center}
          </Box>

          <Box display={{ base: 'none', lg: 'block' }} w={{ lg: '30%' }}>
            {right}
          </Box>
        </Flex>
      </Center>
      <MobileNav />
    </Box>
  );
};

export default MainLayout;
