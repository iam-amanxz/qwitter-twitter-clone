import {
  Box,
  Button,
  Circle,
  CircularProgress,
  Flex,
  FormControl,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiCamera } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/themeContext';
import { createPost } from '../store/postSlice';
import { showToast } from '../utils';

const TweetModal = ({ isTweetModalOpen, setIsTweetModalOpen }) => {
  const dispatch = useDispatch();
  const { baseTheme, accentTheme } = useTheme();
  const { onClose } = useDisclosure();
  const { currentUser } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.posts);
  const toast = useToast();

  const bodyRef = useRef();
  const [bodyLimit, setBodyLimit] = useState(140);

  const handleClose = () => {
    onClose();
    setIsTweetModalOpen(false);
  };

  const handleCreateTweet = async () => {
    const body = bodyRef.current.value;
    const post = {
      body,
      owner: currentUser.username,
    };

    const res = await dispatch(createPost(post));

    if (res.error) {
      showToast(toast, {
        status: 'error',
        description: res.error,
      });
      return;
    }

    console.log('success creating post');
    handleClose();
  };

  const src =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcnyHcErjXASFe1Imj6U_2lmC6xN-UCNyNKuIvSB21UX3ooLyEgBXgnNWo2TBz6pE9gME&usqp=CAU';

  return (
    <Modal
      isOpen={isTweetModalOpen}
      onClose={handleClose}
      initialFocusRef={bodyRef}
    >
      <ModalOverlay backgroundColor={baseTheme.overlayColor} />

      <ModalContent
        mx={4}
        maxW={'md'}
        borderRadius={'2xl'}
        backgroundColor={baseTheme.backgroundColor}
      >
        <ModalHeader>
          <ModalCloseButton color={baseTheme.textPrimaryColor} />
        </ModalHeader>

        <ModalBody>
          <FormControl>
            <Textarea
              color={baseTheme.textPrimaryColor}
              ref={bodyRef}
              onChange={() => {
                setBodyLimit(140 - bodyRef.current?.value?.length);
              }}
              maxLength={140}
              placeholder="Whats's happening?"
              _focus={{ outline: 'none', borderColor: 'transparent' }}
              _hover={{ outline: 'none', borderColor: 'transparent' }}
              border={'none'}
            />
          </FormControl>

          <Image
            src={src}
            w={'full'}
            h={'56'}
            borderRadius={'lg'}
            mt={4}
            fit={'cover'}
          />
        </ModalBody>

        <ModalFooter borderColor={baseTheme.borderColor} borderTopWidth={'1px'}>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            flexGrow={1}
          >
            <FiCamera
              size={20}
              color={accentTheme.accentColor}
              cursor={'pointer'}
            />
            {/* Camera */}

            <Box>
              {bodyRef.current?.value && (
                <CircularProgress
                  value={bodyLimit}
                  max={140}
                  color={accentTheme.accentColor}
                  size={'32px'}
                  mr={2}
                />
              )}
              <Button
                disabled={!bodyRef.current?.value}
                isLoading={isLoading}
                backgroundColor={accentTheme.accentColor}
                color={accentTheme.textColor}
                _hover={{ backgroundColor: accentTheme.accentHoverColor }}
                size="sm"
                borderRadius={'full'}
                onClick={handleCreateTweet}
              >
                Tweet
              </Button>
            </Box>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TweetModal;
