import {
  Avatar,
  Box,
  Button,
  Circle,
  Flex,
  FormControl,
  FormErrorMessage,
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
import { FiImage } from 'react-icons/fi';
import { useTheme } from '../context/themeContext';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { showToast } from '../utils';
import { storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../store/authSlice';

const EditProfileModal = ({
  user,
  isEditProfileModalOpen,
  setIsEditProfileModalOpen,
}) => {
  const schema = yup
    .object()
    .shape({
      name: yup.string().required('Name is required'),
      bio: yup.string().max(160, "Bio can't be more than 160 characters"),
    })
    .required();

  const { onClose } = useDisclosure();
  const { baseTheme } = useTheme();
  const dispatch = useDispatch();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const defaultImage =
    'https://res.cloudinary.com/dzqbzqgqw/image/upload/v1599590554/default_profile_pic_xqjqjy.png';
  const coverInputRef = useRef();
  const profileInputRef = useRef();
  const [coverPic, setCoverPic] = useState(defaultImage);
  const [profilePic, setProfilePic] = useState(defaultImage);
  const [uploadProgress, setUploadProgress] = useState(0);
  const maxImageSize = 1 * 1024 * 1024; // 1mb

  useEffect(() => {
    setCoverPic(user?.coverPicUrl);
    setProfilePic(user?.profilePicUrl);

    coverInputRef.current ? (coverInputRef.current.value = []) : null;
    profileInputRef.current ? (profileInputRef.current.value = []) : null;
  }, [user]);

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
          onProgress(0);
          reject(error);
        },
        () => {
          console.log('completed upload, getting download url');
          getDownloadURL(task.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
            onProgress(0);
          });
        },
      );
    });
  };
  const onSubmit = async (data) => {
    const updates = data;
    if (coverInputRef.current.files[0]) {
      console.log('uploading cover pic');
      const url = await uploadPicture(
        'coverPics',
        coverInputRef.current.files[0],
        setUploadProgress,
      );
      updates.coverPicUrl = url;
      console.log('upload cover complete');
    }
    if (profileInputRef.current.files[0]) {
      console.log('uploading profile pic');
      const url = await uploadPicture(
        'profilePics',
        profileInputRef.current.files[0],
        setUploadProgress,
      );
      updates.profilePicUrl = url;
      console.log('upload profile complete');
    }

    console.log(updates);
    const res = await dispatch(updateProfile(updates));
    if (res.error) {
      return onError('Error updating profile');
    }

    console.log('submitted');
    handleClose();
    showToast(toast, {
      description: 'Profile updated!',
    });
  };
  const handleClose = () => {
    onClose();
    setIsEditProfileModalOpen(false);
  };
  const onError = (description) => {
    showToast(toast, {
      status: 'error',
      description,
    });
  };
  const validateImage = (t) => {
    const size = t.files[0].size;
    if (size > maxImageSize) {
      onError('Image size is too large, max size is 1mb');
      t.value = [];
      console.log('invalid size');
      console.log(t.files);

      return false;
    }
    console.log('valid size');
    console.log(t.files);

    if (t.name === 'cover') {
      setCoverPic(URL.createObjectURL(t.files[0]));
    } else {
      setProfilePic(URL.createObjectURL(t.files[0]));
    }

    return true;
  };
  const onChangeCapture = (e) => {
    console.log(e.target.src);
    const file = e.target.files[0];
    const validImage = validateImage(e.target);
    if (!validImage) return;
  };

  return (
    <Modal isOpen={isEditProfileModalOpen} onClose={handleClose}>
      <ModalOverlay backgroundColor={baseTheme.overlayColor} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent
          overflow={'hidden'}
          mx={4}
          maxW={'md'}
          borderRadius={'2xl'}
          backgroundColor={baseTheme.backgroundColor}
        >
          {uploadProgress > 0 && (
            <Progress value={uploadProgress} size={'sm'} />
          )}
          <ModalHeader color={baseTheme.textPrimaryColor}>
            Edit Profile
            {!isSubmitting && (
              <ModalCloseButton color={baseTheme.textPrimaryColor} />
            )}
          </ModalHeader>
          <ModalBody>
            <CoverPic
              onClick={() => coverInputRef.current.click()}
              image={coverPic}
            />
            <ProfilePic
              onClick={() => profileInputRef.current.click()}
              image={profilePic}
            />
            <input
              onChange={onChangeCapture}
              name="cover"
              style={{ display: 'none' }}
              type="file"
              ref={coverInputRef}
            />
            <input
              onChange={onChangeCapture}
              name="profile"
              style={{ display: 'none' }}
              type="file"
              ref={profileInputRef}
            />
            <NameInput
              register={register}
              errors={errors}
              defaultValue={user?.name}
            />
            <BioInput
              register={register}
              errors={errors}
              defaultValue={user?.bio}
            />
          </ModalBody>

          <ModalFooter>
            <CancelButton onClick={handleClose} />
            <SubmitButton isLoading={isSubmitting} />
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

const CoverPic = (props) => {
  return (
    <Box position={'relative'} borderRadius={'md'} overflow={'hidden'}>
      <Image
        src={props.image}
        {...props}
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
          onClick={props.onClick}
          color="white"
          fontSize={'1.3em'}
          cursor={'pointer'}
        />
      </Stack>
    </Box>
  );
};
const ProfilePic = (props) => {
  const { baseTheme } = useTheme();
  return (
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
          src={props.image}
          {...props}
          h={'100%'}
          w={'100%'}
          objectFit={'cover'}
          fontSize={'8xl'}
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
          onClick={props.onClick}
          color="white"
          fontSize={'1.3em'}
          cursor={'pointer'}
        />
      </Flex>
    </Box>
  );
};
const NameInput = ({ register, errors, defaultValue }) => {
  const { baseTheme } = useTheme();

  return (
    <FormControl
      mb={4}
      borderColor={baseTheme.borderColor}
      isInvalid={errors.name}
    >
      <FormLabel color={baseTheme.textPrimaryColor} mb={0} htmlFor="name">
        Name
      </FormLabel>
      <Input
        defaultValue={defaultValue}
        {...register('name')}
        color={baseTheme.textPrimaryColor}
        placeholder="Name"
        type={'text'}
      />
      <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
    </FormControl>
  );
};
const BioInput = ({ register, errors, defaultValue }) => {
  const { baseTheme } = useTheme();
  return (
    <FormControl
      color={baseTheme.textPrimaryColor}
      borderColor={baseTheme.borderColor}
    >
      <FormLabel mb={0}>Bio</FormLabel>
      <Textarea
        defaultValue={defaultValue}
        {...register('bio')}
        color={baseTheme.textPrimaryColor}
        placeholder="Bio"
        maxLength={160}
      />
      <FormErrorMessage>{errors.bio && errors.bio.message}</FormErrorMessage>
    </FormControl>
  );
};
const SubmitButton = (props) => {
  const { accentTheme } = useTheme();
  return (
    <Button
      {...props}
      type="submit"
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
  );
};
const CancelButton = (props) => {
  const { baseTheme } = useTheme();
  return (
    <Button
      {...props}
      borderWidth={'1px'}
      color={baseTheme.textPrimaryColor}
      borderColor={baseTheme.borderColorAlt}
      backgroundColor={baseTheme.backgroundColor}
      mr={3}
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
  );
};

export default EditProfileModal;
