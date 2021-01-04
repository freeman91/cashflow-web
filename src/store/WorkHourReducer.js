export const WORK_HOUR_INITIAL_STATE = { list: [] };

export const workHourReducer = (state = WORK_HOUR_INITIAL_STATE, action) => {
  switch (action.type) {
    case "UPDATE_WORK_HOURS":
      return { ...action.payload };
    default:
      return state;
  }
};
