export const INCOME_INITIAL_STATE = { list: [] };

export const incomeReducer = (state = INCOME_INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_INCOMES':
      return { ...action.payload };
    default:
      return state;
  }
};
