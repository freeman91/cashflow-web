export const showSuccessSnackbar = (message) => ({
  type: 'SNACKBAR_SUCCESS',
  payload: { message },
});

export const showErrorSnackbar = (message) => ({
  type: 'SNACKBAR_ERROR',
  payload: { message },
});

export const clearSnackbar = () => ({
  type: 'SNACKBAR_CLEAR',
  payload: {},
});
