export const EXPENSE_GROUP_INITIAL_STATE = { list: [] };

export const expenseGroupReducer = (
  state = EXPENSE_GROUP_INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case 'UPDATE_EXPENSE_GROUPS':
      return { ...action.payload };
    default:
      return state;
  }
};
