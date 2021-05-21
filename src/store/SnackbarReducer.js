export const snackbarReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SNACKBAR_SUCCESS':
      return {
        ...state,
        severity: 'success',
        open: true,
        message: action.payload.message,
      };
    case 'SNACKBAR_ERROR':
      return {
        ...state,
        severity: 'error',
        open: true,
        message: action.payload.message,
      };
    case 'SNACKBAR_CLEAR':
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
};
