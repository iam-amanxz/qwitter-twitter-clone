export const showToast = (
  ctx,
  { title, description, status, duration, position },
) => {
  ctx({
    title: title,
    description: description && description,
    status: status || 'success',
    duration: duration || 2000,
    isClosable: true,
    position: position || 'bottom-right',
  });
};
