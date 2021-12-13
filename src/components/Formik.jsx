import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useField } from 'formik';

export const CustomInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <Box mb={props.mb}>
      <FormControl isInvalid={meta.touched && !!meta.error}>
        <FormLabel mb={0}>{label}</FormLabel>
        <Input
          {...field}
          placeholder={label}
          ref={props.reference}
          type={props.type || 'text'}
        />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    </Box>
  );
};
