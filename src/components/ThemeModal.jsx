import {
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useTheme } from '../context/themeContext';

const ThemeModal = ({ isThemeModalOpen, setIsThemeModalOpen }) => {
  const { baseTheme, setBaseTheme, accentTheme, setAccentTheme, themes } =
    useTheme();
  const { onClose } = useDisclosure();

  const handleClose = () => {
    onClose();
    setIsThemeModalOpen(false);
  };

  const handleSaveTheme = () => {
    localStorage.setItem('baseTheme', baseTheme.name);
    localStorage.setItem('accentTheme', accentTheme.name);
    onClose();
    setIsThemeModalOpen(false);
  };

  return (
    <Modal isOpen={isThemeModalOpen} onClose={handleClose} isCentered>
      <ModalOverlay backgroundColor={baseTheme.overlayColor} />

      <ModalContent
        mx={4}
        maxW={'md'}
        borderRadius={'2xl'}
        backgroundColor={baseTheme.backgroundColor}
      >
        <ModalHeader color={baseTheme.textPrimaryColor}>
          Customize your view
        </ModalHeader>
        <ModalCloseButton color={baseTheme.textPrimaryColor} />

        <ModalBody>
          <Heading size={'xs'} mb={2} color={baseTheme.textSecondaryColor}>
            Accent Color
          </Heading>
          <Stack
            justifyContent={'space-between'}
            direction={'row'}
            spacing={6}
            mb={8}
            p={3}
            borderRadius={'lg'}
            backgroundColor={baseTheme.backgroundLightColor}
          >
            {Object.entries(themes.accentThemes).map(([key, value]) => (
              <Circle
                key={key}
                size={8}
                bg={value.accentColor}
                cursor={'pointer'}
                _hover={{
                  borderWidth: '2px',
                  borderColor: value.accentHoverColor,
                }}
                onClick={() => {
                  setAccentTheme(themes.accentThemes[key]);
                }}
              />
            ))}
          </Stack>

          <Heading size={'xs'} mb={2} color={baseTheme.textSecondaryColor}>
            Background Color
          </Heading>
          <Stack
            justifyContent={'space-between'}
            direction={'row'}
            spacing={3}
            p={3}
            borderRadius={'lg'}
            backgroundColor={baseTheme.backgroundLightColor}
          >
            {Object.entries(themes.baseThemes).map(([key, value]) => (
              <Box
                textAlign={'center'}
                flexGrow={1}
                key={key}
                bg={value.backgroundColor}
                borderWidth={'2px'}
                borderColor={value.borderColor}
                p={3}
                borderRadius={'lg'}
                cursor={'pointer'}
                onClick={() => {
                  setBaseTheme(themes.baseThemes[key]);
                }}
              >
                <Heading size={'sm'} color={value.textPrimaryColor}>
                  {value.name}
                </Heading>
              </Box>
            ))}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            backgroundColor={accentTheme.accentColor}
            color={accentTheme.textColor}
            _hover={{ backgroundColor: accentTheme.accentHoverColor }}
            size={'sm'}
            borderRadius={'full'}
            onClick={handleSaveTheme}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ThemeModal;
