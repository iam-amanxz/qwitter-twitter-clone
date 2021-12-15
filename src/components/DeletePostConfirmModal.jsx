import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '../context/themeContext';
import { deletePost } from '../store/postSlice';
import { showToast } from '../utils';

const DeletePostConfirmModal = ({
  postId,
  openDeleteConfirmDialog,
  setOpenDeleteConfirmDialog,
}) => {
  const cancelRef = useRef();

  const dispatch = useDispatch();
  const toast = useToast();
  const { baseTheme } = useTheme();

  const onClose = () => setOpenDeleteConfirmDialog(false);

  const handlePostDelete = async () => {
    const res = await dispatch(deletePost(postId));
    if (res.error) {
      showToast(toast, {
        status: 'error',
        description: res.error,
      });
    }
  };

  return (
    <AlertDialog
      isOpen={openDeleteConfirmDialog}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay backgroundColor={baseTheme.overlayColor}>
        <AlertDialogContent
          maxW={'xs'}
          backgroundColor={baseTheme.backgroundColor}
        >
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            color={baseTheme.textPrimaryColor}
          >
            Delete Qweet
          </AlertDialogHeader>

          <AlertDialogBody color={baseTheme.textSecondaryColor}>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handlePostDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeletePostConfirmModal;
