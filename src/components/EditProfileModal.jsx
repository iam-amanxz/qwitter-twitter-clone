import {
  Avatar,
  Box,
  Button,
  Circle,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FiImage, FiX } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useTheme } from '../context/themeContext';
import { storage } from '../firebase';
import { updateProfile } from '../store/authSlice';
import { showToast } from '../utils';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const EditProfileModal = ({
  user,
  isEditProfileModalOpen,
  setIsEditProfileModalOpen,
}) => {
  const { onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();
  const { baseTheme, accentTheme } = useTheme();

  const initialValues = {
    name: '',
    bio: null,
    coverPicUrl: 'https://wallpaperaccess.com/full/1285952.jpg',
    profilePicUrl: 'https://wallpaperaccess.com/full/1285952.jpg',
  };
  const maxImageSize = 1 * 1024 * 1024; // 1mb
  const [loading, setLoading] = useState(false);
  const coverPicInputRef = useRef();
  const profilePicInputRef = useRef();
  const [formValues, setFormValues] = useState(initialValues);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [coverPicSelected, setCoverPicSelected] = useState(false);
  const [profilePicSelected, setProfilePicSelected] = useState(false);

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user?.name,
        bio: user?.bio,
        profilePicUrl: user?.profilePicUrl || initialValues.profilePicUrl,
        coverPicUrl: user?.coverPicUrl || initialValues.coverPicUrl,
      });
    }
  }, [user]);
  const handleClose = () => {
    setFormValues({
      name: user?.name,
      bio: user?.bio,
      profilePicUrl: user?.profilePicUrl || initialValues.profilePicUrl,
      coverPicUrl: user?.coverPicUrl || initialValues.coverPicUrl,
    });
    setProfilePicSelected(false);
    setCoverPicSelected(false);
    coverPicInputRef.current = null;
    profilePicInputRef.current = null;
    setIsEditProfileModalOpen(false);
    onClose();
    setLoading(false);
  };
  const validateImageSize = (target, size) => {
    if (size > maxImageSize) {
      onError('Image size is too large, max size is 1mb');
      target.value = null;
      return false;
    }
    console.log('valid size');
    return true;
  };
  const onError = (description) => {
    showToast(toast, {
      status: 'error',
      description,
    });
    setLoading(false);
    return;
  };
  const handleSelectImage = (e) => {
    console.log('handling image selection');
    const file = e.target.files[0];
    const validSize = validateImageSize(e.target, file.size);
    if (!validSize) return;

    switch (e.target.name) {
      case 'cover':
        setFormValues({
          ...formValues,
          coverPicUrl: URL.createObjectURL(file),
        });
        setCoverPicSelected(true);
        break;
      case 'profile':
        setFormValues({
          ...formValues,
          profilePicUrl: URL.createObjectURL(file),
        });
        setProfilePicSelected(true);
        break;
    }
  };
  const uploadPicture = (path, file, onProgress) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `${path}/${uuid()}`);
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        'state_changed',
        (snapshot) => {
          onProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
          );
        },
        (error) => {
          task.cancel();
          reject(error);
        },
        () => {
          console.log('completed upload, getting download url');
          getDownloadURL(task.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  };
  const handleUpdateProfile = async () => {
    setLoading(true);
    const updates = formValues;

    if (updates.name.trim() === '') {
      return onError('Name cannot be empty');
    }

    if (coverPicSelected) {
      try {
        const url = await uploadPicture(
          'coverPics',
          coverPicInputRef.current.files[0],
          setUploadProgress,
        );
        updates.coverPicUrl = url;
      } catch (e) {
        return onError('Error uploading cover picture');
      }
    }

    if (profilePicSelected) {
      try {
        const url = await uploadPicture(
          'profilePics',
          profilePicInputRef.current.files[0],
          setUploadProgress,
        );
        updates.profilePicUrl = url;
      } catch (e) {
        return onError('Error uploading profile picture');
      }
    }

    const res = await dispatch(updateProfile(updates));
    if (res.error) {
      return onError('Error updating profile');
    }

    setLoading(false);
    handleClose();
  };

  return (
    <Modal isOpen={isEditProfileModalOpen} onClose={handleClose}>
      <ModalOverlay backgroundColor={baseTheme.overlayColor} />
      <ModalContent
        overflow={'hidden'}
        mx={4}
        maxW={'md'}
        borderRadius={'2xl'}
        backgroundColor={baseTheme.backgroundColor}
      >
        {uploadProgress > 0 && <Progress value={uploadProgress} size={'sm'} />}
        <ModalHeader color={baseTheme.textPrimaryColor}>
          Edit Profile
          {!loading && <ModalCloseButton color={baseTheme.textPrimaryColor} />}
        </ModalHeader>

        <ModalBody>
          <Box position={'relative'} borderRadius={'md'} overflow={'hidden'}>
            {/* Cover Pic upload overlay*/}
            <Image
              src={formValues.coverPicUrl}
              h={{ base: 24, md: 28 }}
              w={'full'}
              objectFit={'cover'}
            />

            <Stack
              direction={'row'}
              spacing={4}
              alignItems={'center'}
              justifyContent={'center'}
              position={'absolute'}
              top={0}
              left={0}
              w={'full'}
              h={'full'}
              backgroundColor={'blackAlpha.700'}
            >
              <FiImage
                color="white"
                fontSize={'1.3em'}
                onClick={() => {
                  coverPicInputRef.current.click();
                }}
                cursor={'pointer'}
              />

              {/* <FiX
                onClick={() => {}}
                color="white"
                fontSize={'1.3em'}
                cursor={'pointer'}
              /> */}
            </Stack>
          </Box>

          {/* Profile Pic upload overlay*/}
          <Box
            mt={-10}
            ml={2}
            w={'max'}
            mb={4}
            position={'relative'}
            borderRadius={'full'}
            overflow={'hidden'}
          >
            <Circle
              size={{ base: '20', md: '24' }}
              overflow={'hidden'}
              borderWidth={'4px'}
              borderColor={baseTheme.backgroundColor}
            >
              <Avatar
                h={'100%'}
                w={'100%'}
                objectFit={'cover'}
                name={user?.name}
                fontSize={'8xl'}
                src={formValues.profilePicUrl}
              />
            </Circle>

            <Flex
              alignItems={'center'}
              justifyContent={'center'}
              position={'absolute'}
              top={0}
              left={0}
              w={'full'}
              h={'full'}
              backgroundColor={'blackAlpha.600'}
            >
              <FiImage
                onClick={() => {}}
                color="white"
                fontSize={'1.3em'}
                onClick={() => {
                  profilePicInputRef.current.click();
                }}
                cursor={'pointer'}
              />
            </Flex>
          </Box>

          <FormControl mb={4} borderColor={baseTheme.borderColor}>
            {/* Hidden inputs */}
            <>
              <Input
                name="cover"
                onChange={handleSelectImage}
                type={'file'}
                display={'none'}
                ref={coverPicInputRef}
                accept="image/jpeg,image/png,image/jpg"
              />
              <Input
                name="profile"
                onChange={handleSelectImage}
                type={'file'}
                display={'none'}
                ref={profilePicInputRef}
                accept="image/jpeg,image/png,image/jpg"
              />
            </>
            <FormLabel color={baseTheme.textPrimaryColor} mb={0}>
              Name
            </FormLabel>
            <Input
              color={baseTheme.textPrimaryColor}
              value={formValues.name}
              placeholder="Name"
              type={'text'}
              onChange={(e) => {
                setFormValues({ ...formValues, name: e.target.value });
              }}
            />
          </FormControl>

          <FormControl
            color={baseTheme.textPrimaryColor}
            borderColor={baseTheme.borderColor}
          >
            <FormLabel mb={0}>Bio</FormLabel>
            <Textarea
              color={baseTheme.textPrimaryColor}
              value={formValues.bio}
              placeholder="Bio"
              maxLength={160}
              onChange={(e) => {
                setFormValues({ ...formValues, bio: e.target.value });
              }}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            borderWidth={'1px'}
            color={baseTheme.textPrimaryColor}
            borderColor={baseTheme.borderColorAlt}
            backgroundColor={baseTheme.backgroundColor}
            mr={3}
            onClick={handleClose}
            size={'sm'}
            borderRadius={'full'}
            _hover={{
              backgroundColor: baseTheme.backgroundHoverColor,
            }}
            _focus={{
              backgroundColor: baseTheme.backgroundHoverColor,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProfile}
            isLoading={loading}
            size={'sm'}
            borderRadius={'full'}
            backgroundColor={accentTheme.accentColor}
            color={accentTheme.textColor}
            _hover={{
              backgroundColor: accentTheme.accentHoverColor,
            }}
            _focus={{
              backgroundColor: accentTheme.accentHoverColor,
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
