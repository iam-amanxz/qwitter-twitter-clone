import {
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  Progress,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
  Circle,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiImage, FiX } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/themeContext';
import { createPost, uploadPostImage } from '../store/postSlice';
import { showToast } from '../utils';
import { ref } from 'firebase/storage';
import { storage } from '../firebase.js';
import { v4 as uuid } from 'uuid';

const TweetModal = ({ isTweetModalOpen, setIsTweetModalOpen }) => {
  const dispatch = useDispatch();
  const { baseTheme, accentTheme } = useTheme();
  const { onClose } = useDisclosure();
  const { currentUser } = useSelector((state) => state.auth);
  const toast = useToast();

  const bodyRef = useRef();
  const imageInputRef = useRef();
  const [bodyLimit, setBodyLimit] = useState(140);
  const [imageSelected, setImageSelected] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const maxImageSize = 2 * 1024 * 1024; // 2mb
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setImageSelected(false);
    setImageUrl('');
    imageInputRef.current.files = null;

    onClose();
    setIsTweetModalOpen(false);
  };

  const handleRemoveSelectedImage = () => {
    setImageSelected(false);
    setImageUrl('');
    imageInputRef.current.files = null;
  };

  const handleSelectImage = () => {
    setImageSelected(false);

    const file = imageInputRef.current.files[0];
    const fileSize = file.size;

    if (fileSize > maxImageSize) {
      showToast(toast, {
        status: 'warning',
        description: 'Image size is too large, max size is 2mb',
      });
      imageInputRef.current.files = null;
      return;
    }

    if (file) {
      console.log('image selected');
      setImageUrl(URL.createObjectURL(file));
      setImageSelected(true);
    }
  };

  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      const postsPicsStorageRef = ref(storage, `postPics/${uuid()}`);

      uploadPostImage(
        postsPicsStorageRef,
        imageInputRef.current.files[0],
        (progress) => {
          setUploadProgress(progress);
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        (url) => {
          setUploadProgress(0);
          resolve(url);
        },
      );
    });
  };

  const handleCreateTweet = async () => {
    setLoading(true);
    const body = bodyRef.current.value;
    const post = {
      body,
      owner: currentUser.username,
    };

    if (imageSelected) {
      console.log('uploading image');

      try {
        const url = await uploadImage();
        post.imageUrl = url;
      } catch (error) {
        showToast(toast, {
          status: 'error',
          description: 'Error uploading image',
        });
        setLoading(false);
      }
    }

    const res = await dispatch(createPost(post));

    if (res.error) {
      showToast(toast, {
        status: 'error',
        description: res.error,
      });
      setLoading(false);
      return;
    }

    console.log('success creating post');
    showToast(toast, {
      description: 'Your qweet was sent!',
    });
    setLoading(false);
    handleClose();
  };

  return (
    <Modal
      isOpen={isTweetModalOpen}
      onClose={handleClose}
      initialFocusRef={bodyRef}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay backgroundColor={baseTheme.overlayColor} />

      <ModalContent
        overflow={'hidden'}
        mx={4}
        maxW={'md'}
        borderRadius={'2xl'}
        backgroundColor={baseTheme.backgroundColor}
      >
        <Progress
          value={uploadProgress}
          size={'xs'}
          display={uploadProgress > 0 ? 'block' : 'none'}
        />
        <ModalHeader>
          {!loading && <ModalCloseButton color={baseTheme.textPrimaryColor} />}
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

          <Input
            type={'file'}
            ref={imageInputRef}
            display={'none'}
            onChangeCapture={handleSelectImage}
            accept="image/jpeg,image/png,image/jpg"
          />

          {imageSelected && (
            <Box position={'relative'}>
              <Image
                src={imageUrl}
                w={'full'}
                h={'56'}
                borderRadius={'lg'}
                mt={4}
                fit={'cover'}
              />

              <Circle
                boxShadow={'md'}
                onClick={handleRemoveSelectedImage}
                position={'absolute'}
                cursor={'pointer'}
                top={2}
                right={2}
                p={2}
                backgroundColor={'white'}
              >
                <FiX />
              </Circle>
            </Box>
          )}
        </ModalBody>

        <ModalFooter borderColor={baseTheme.borderColor} borderTopWidth={'1px'}>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            flexGrow={1}
          >
            {/* Camera */}
            <FiImage
              size={20}
              color={accentTheme.accentColor}
              cursor={'pointer'}
              onClick={() => imageInputRef.current.click()}
            />

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
                isLoading={loading}
                backgroundColor={accentTheme.accentColor}
                color={accentTheme.textColor}
                _hover={{ backgroundColor: accentTheme.accentHoverColor }}
                size="sm"
                borderRadius={'full'}
                onClick={handleCreateTweet}
              >
                Qweet
              </Button>
            </Box>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TweetModal;
