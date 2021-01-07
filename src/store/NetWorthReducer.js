export const netWorthReducer = (state = { chartData: {} }, action) => {
  switch (action.type) {
    case "UPDATE_NETWORTH_DATA":
      return { ...action.payload };
    default:
      return state;
  }
};
