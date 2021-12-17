import { Box, Center, Flex } from '@chakra-ui/react';
import { useTheme } from '../context/themeContext';

const MainLayout = ({ left, right, center }) => {
  const { baseTheme } = useTheme();

  return (
    <Box
      w={'100vw'}
      minH={'100vh'}
      px={4}
      backgroundColor={baseTheme.backgroundColor}
    >
      <Center mx={'auto'} maxWidth={'1200px'}>
        <Flex flexGrow={1}>
          <Box w={{ base: '10%', lg: '20%' }}>{left}</Box>

          <Box
            borderWidth={'1px'}
            borderColor={baseTheme.borderColor}
            minH={'100vh'}
            w={{ base: '90%', lg: '50%' }}
          >
            {center}
          </Box>

          <Box display={{ base: 'none', lg: 'block' }} w={{ md: '30%' }}>
            {right}
          </Box>
        </Flex>
      </Center>
    </Box>
  );
};

export default MainLayout;
