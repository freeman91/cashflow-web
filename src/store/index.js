import { combineReducers } from "redux";

import { USER_INITIAL_STATE, userReducer } from "./UserReducer";
import { updateUser } from "./UserAction";

import { EXPENSE_INITIAL_STATE, expenseReducer } from "./ExpenseReducer";
import { updateExpenses } from "./ExpenseAction";

import { INCOME_INITIAL_STATE, incomeReducer } from "./IncomeReducer";
import { updateIncomes } from "./IncomeAction";

import { WORK_HOUR_INITIAL_STATE, workHourReducer } from "./WorkHourReducer";
import { updateWorkHours } from "./WorkHourAction";

export const Reducer = combineReducers({
  user: userReducer,
  expenses: expenseReducer,
  incomes: incomeReducer,
  workHours: workHourReducer,
});

export {
  USER_INITIAL_STATE,
  EXPENSE_INITIAL_STATE,
  INCOME_INITIAL_STATE,
  WORK_HOUR_INITIAL_STATE,
  updateUser,
  updateExpenses,
  updateIncomes,
  updateWorkHours,
};
