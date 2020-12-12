export const updateUser = (user) => ({
  type: "UPDATE_USER",
  payload: user,
});

export const resetUser = () => ({
  type: "RESET_USER",
  payload: {},
});
