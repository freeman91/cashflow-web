import { combineReducers } from "redux";

import { USER_INITIAL_STATE, userReducer } from "./UserReducer";
import { updateUser, resetUser } from "./UserAction";

export const Reducer = combineReducers({
  user: userReducer,
});

export { USER_INITIAL_STATE, updateUser, resetUser };
