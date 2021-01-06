export const USER_INITIAL_STATE = { email: "", token: "" };

export const userReducer = (state = USER_INITIAL_STATE, action) => {
  switch (action.type) {
    case "UPDATE_USER":
      return { ...action.payload };
    default:
      return state;
  }
};
