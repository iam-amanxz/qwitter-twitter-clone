import { Box, Button, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import SideBar from '../components/SideBar';
import SideNav from '../components/SideNav';
import { useTheme } from '../context/themeContext';
import MainLayout from '../layout/MainLayout';

const NotFoundPage = () => {
  const { baseTheme, accentTheme } = useTheme();

  const renderCenter = () => {
    return (
      <Box p={3} textAlign={'center'}>
        <Heading color={baseTheme.textPrimaryColor}>404</Heading>
        <Text color={baseTheme.textSecondaryColor} mb={5}>
          hmm... looks like you are lost.
        </Text>
        <Button
          backgroundColor={accentTheme.accentColor}
          borderRadius={'999px'}
          _hover={{ backgroundColor: accentTheme.accentHoverColor }}
          _focus={{ backgroundColor: accentTheme.accentHoverColor }}
          color={accentTheme.textColor}
        >
          Go Home
        </Button>
      </Box>
    );
  };

  return (
    <MainLayout
      left={<SideNav />}
      center={renderCenter()}
      right={<SideBar />}
    />
  );
};

export default NotFoundPage;
