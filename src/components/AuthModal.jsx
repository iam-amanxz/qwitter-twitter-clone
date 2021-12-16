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
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useTheme } from '../context/themeContext';
import { login, register } from '../store/authSlice';
import { showToast } from '../utils';
import { CustomInput } from './Formik';

const AuthModal = ({ isAuthModalOpen, setIsAuthModalOpen, isSignUpActive }) => {
  const { onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { baseTheme, accentTheme } = useTheme();

  const nameRef = useRef();
  const emailRef = useRef();

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
          .trim()
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
          .trim()
          .required('Username is required')
          .min(3, 'Username must be at least 3 characters')
          .matches(
            /^[a-zA-Z0-9]*$/,
            'Username can only contain letters and numbers, no spaces',
          ),
        email: yup
          .string()
          .trim()
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
    if (!isSignUpActive) {
      console.log('login');

      const res = await dispatch(
        login({ email: values.email.trim(), password: values.password }),
      );
      if (res.error) {
        showToast(toast, {
          status: 'error',
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
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
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
        showToast(toast, {
          status: 'error',
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
      <ModalOverlay backgroundColor={baseTheme.overlayColor} />

      <ModalContent
        mx={4}
        maxW={'sm'}
        borderRadius={'2xl'}
        backgroundColor={baseTheme.backgroundColor}
      >
        {/* header */}
        <ModalHeader color={baseTheme.textPrimaryColor}>
          {isSignUpActive ? 'Create your account' : 'Sign in to Qwitter'}
        </ModalHeader>
        <ModalCloseButton color={baseTheme.textPrimaryColor} />

        {/* body */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema()}
          onSubmit={handleFormSubmit}
        >
          {(formik) => (
            <Form>
              <Box>
                <ModalBody color={baseTheme.textSecondaryColor}>
                  {isSignUpActive && (
                    <Box>
                      <CustomInput
                        borderColor={baseTheme.borderColor}
                        name="name"
                        label="Name"
                        mb={4}
                        reference={nameRef}
                      />
                      <CustomInput
                        borderColor={baseTheme.borderColor}
                        name="username"
                        label="Username"
                        mb={4}
                      />
                    </Box>
                  )}
                  <CustomInput
                    borderColor={baseTheme.borderColor}
                    name="email"
                    label="Email"
                    mb={4}
                    reference={emailRef}
                  />
                  <CustomInput
                    borderColor={baseTheme.borderColor}
                    name="password"
                    label="Password"
                    type="password"
                  />
                </ModalBody>

                <ModalFooter>
                  <Button
                    backgroundColor={accentTheme.accentColor}
                    color={accentTheme.textColor}
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
