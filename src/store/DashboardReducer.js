export const dashboardReducer = (
  state = { expenseSum: 0, incomeSum: 0, workHour: 0, groupedExpenses: {} },
  action
) => {
  switch (action.type) {
    case "UPDATE_DATA":
      return { ...action.payload };
    default:
      return state;
  }
};
