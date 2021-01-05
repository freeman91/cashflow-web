import { combineReducers } from "redux";

import { USER_INITIAL_STATE, userReducer } from "./UserReducer";
import { updateUser } from "./UserAction";

import { EXPENSE_INITIAL_STATE, expenseReducer } from "./ExpenseReducer";
import { updateExpenses } from "./ExpenseAction";

import { INCOME_INITIAL_STATE, incomeReducer } from "./IncomeReducer";
import { updateIncomes } from "./IncomeAction";

import { WORK_HOUR_INITIAL_STATE, workHourReducer } from "./WorkHourReducer";
import { updateWorkHours } from "./WorkHourAction";

import { ASSET_INITIAL_STATE, assetReducer } from "./AssetReducer";
import { updateAssets } from "./AssetAction";

import { LIABILITY_INITIAL_STATE, liabilityReducer } from "./LiabilityReducer";
import { updateLiabilities } from "./LiabilityAction";

export const Reducer = combineReducers({
  user: userReducer,
  expenses: expenseReducer,
  incomes: incomeReducer,
  workHours: workHourReducer,
  assets: assetReducer,
  liabilities: liabilityReducer,
});

export {
  USER_INITIAL_STATE,
  EXPENSE_INITIAL_STATE,
  INCOME_INITIAL_STATE,
  WORK_HOUR_INITIAL_STATE,
  ASSET_INITIAL_STATE,
  LIABILITY_INITIAL_STATE,
  updateUser,
  updateExpenses,
  updateIncomes,
  updateWorkHours,
  updateAssets,
  updateLiabilities,
};
