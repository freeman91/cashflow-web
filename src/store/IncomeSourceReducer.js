export const INCOME_SOURCE_INITIAL_STATE = { list: [] };

export const incomeSourceReducer = (
  state = INCOME_SOURCE_INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case "UPDATE_INCOME_SOURCES":
      return { ...action.payload };
    default:
      return state;
  }
};
