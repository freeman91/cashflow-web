export const LIABILITY_GROUP_INITIAL_STATE = { list: [] };

export const liabilityGroupReducer = (
  state = LIABILITY_GROUP_INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case "UPDATE_LIABILITY_GROUPS":
      return { ...action.payload };
    default:
      return state;
  }
};
