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
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/themeContext';
import { logout } from '../store/authSlice';

const LogoutModal = ({ isLogoutModalOpen, setIsLogoutModalOpen }) => {
  const dispatch = useDispatch();
  const { baseTheme, accentTheme } = useTheme();
  const { onClose } = useDisclosure();
  const { currentUser } = useSelector((state) => state.auth);

  const handleClose = () => {
    onClose();
    setIsLogoutModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Modal isOpen={isLogoutModalOpen} onClose={handleClose} isCentered>
      <ModalOverlay backgroundColor={baseTheme.overlayColor} />

      <ModalContent
        p={5}
        mx={4}
        maxW={'xs'}
        borderRadius={'2xl'}
        backgroundColor={baseTheme.backgroundColor}
      >
        <ModalBody textAlign={'center'}>
          <Heading size={'lg'} mb={2} color={baseTheme.textPrimaryColor}>
            Logout
          </Heading>
          <Text fontSize={'md'} color={baseTheme.textSecondaryColor}>
            Are you sure you want to log out of @{currentUser?.username}?
          </Text>
        </ModalBody>

        <ModalFooter>
          <Stack flexGrow={1}>
            <Button
              backgroundColor={accentTheme.accentColor}
              color={accentTheme.textColor}
              _hover={{ backgroundColor: accentTheme.accentHoverColor }}
              isFullWidth
              borderRadius={'full'}
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              color={accentTheme.accentColor}
              borderColor={accentTheme.accentColor}
              _hover={{
                backgroundColor: accentTheme.accentHoverColor,
                color: accentTheme.textColor,
              }}
              borderRadius={'full'}
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogoutModal;
