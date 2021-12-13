import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { login, register } from '../store/authSlice';
import { CustomInput } from './Formik';

const AuthModal = ({ isAuthModalOpen, setIsAuthModalOpen, isSignUpActive }) => {
  const { onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const nameRef = useRef();
  const emailRef = useRef();

  const showToast = ({ title, description, status, duration, position }) => {
    toast({
      title: title,
      description: description && description,
      status: status || 'success',
      duration: duration || 2000,
      isClosable: true,
      position: position && position,
    });
  };

  const handleClose = () => {
    onClose();
    setIsAuthModalOpen(false);
  };

  const initialValues = {
    name: '',
    username: '',
    email: '',
    password: '',
  };

  const validationSchema = () => {
    if (!isSignUpActive) {
      return yup.object({
        email: yup
          .string()
          .required('Email is required')
          .email('Invalid email'),
        password: yup
          .string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters'),
      });
    } else {
      return yup.object({
        name: yup.string().required('Name is required'),
        username: yup
          .string()
          .required('Username is required')
          .min(3, 'Username must be at least 3 characters'),
        email: yup
          .string()
          .required('Email is required')
          .email('Invalid email'),
        password: yup
          .string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters'),
      });
    }
  };

  const handleFormSubmit = async (values, actions) => {
    console.log('Form data', values);

    if (!isSignUpActive) {
      console.log('login');

      const res = await dispatch(
        login({ email: values.email, password: values.password }),
      );
      if (res.error) {
        showToast({
          title: 'Error',
          description: res.payload,
        });
        actions.setSubmitting(false);
        return;
      }
      console.log('success login');
      handleClose();
      navigate('/');
    } else {
      console.log('register');
      const { name, username, email, password } = values;

      const res = await dispatch(
        register({
          name,
          username,
          email,
          password,
          bio: null,
          profilePicUrl: null,
          coverPicUrl: null,
          following: [],
          followers: [],
          createdAt: new Date().toISOString(),
        }),
      );

      if (res.error) {
        showToast({
          title: 'Error',
          description: res.payload,
        });
        actions.setSubmitting(false);
        return;
      }
      console.log('success register');
      handleClose();
      navigate('/');
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={handleClose}
      initialFocusRef={isSignUpActive ? nameRef : emailRef}
    >
      <ModalOverlay />

      <ModalContent mx={4} maxW={'sm'} borderRadius={'2xl'}>
        {/* header */}
        <ModalHeader>
          {isSignUpActive ? 'Create your account' : 'Sign in to Qwitter'}
        </ModalHeader>
        <ModalCloseButton />

        {/* body */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema()}
          onSubmit={handleFormSubmit}
        >
          {(formik) => (
            <Form>
              <Box>
                <ModalBody>
                  {isSignUpActive && (
                    <Box>
                      <CustomInput
                        name="name"
                        label="Name"
                        mb={4}
                        reference={nameRef}
                      />
                      <CustomInput name="username" label="Username" mb={4} />
                    </Box>
                  )}
                  <CustomInput
                    name="email"
                    label="Email"
                    mb={4}
                    reference={emailRef}
                  />
                  <CustomInput
                    name="password"
                    label="Password"
                    type="password"
                  />
                </ModalBody>

                <ModalFooter>
                  <Button
                    isLoading={formik.isSubmitting}
                    isFullWidth
                    borderRadius={'full'}
                    disabled={!formik.dirty || !formik.isValid}
                    type="submit"
                  >
                    {isSignUpActive ? 'Create Account' : 'Sign In'}
                  </Button>
                </ModalFooter>
              </Box>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
