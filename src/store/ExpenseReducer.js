export const EXPENSE_INITIAL_STATE = { list: [] };

export const expenseReducer = (state = EXPENSE_INITIAL_STATE, action) => {
  switch (action.type) {
    case "UPDATE_EXPENSES":
      return { ...action.payload };
    default:
      return state;
  }
};
