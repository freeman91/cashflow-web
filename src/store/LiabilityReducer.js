export const LIABILITY_INITIAL_STATE = { list: [] };

export const liabilityReducer = (state = LIABILITY_INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_LIABILITIES':
      return { ...action.payload };
    default:
      return state;
  }
};
