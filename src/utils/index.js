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

export const pageVariants = {
  initial: {
    opacity: 0,
    bottom: '-100vh',
  },
  in: {
    opacity: 1,
    bottom: 0,
  },
  out: {
    opacity: 0,
    bottom: '-100vh',
  },
};
