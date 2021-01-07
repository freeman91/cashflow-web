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

import {
  EXPENSE_GROUP_INITIAL_STATE,
  expenseGroupReducer,
} from "./ExpenseGroupReducer";
import { updateExpenseGroups } from "./ExpenseGroupAction";

import {
  INCOME_SOURCE_INITIAL_STATE,
  incomeSourceReducer,
} from "./IncomeSourceReducer";
import { updateIncomeSources } from "./IncomeSourceAction";

import {
  LIABILITY_GROUP_INITIAL_STATE,
  liabilityGroupReducer,
} from "./LiabilityGroupReducer";
import { updateLiabilityGroups } from "./LiabilityGroupAction";

import {
  ASSET_SOURCE_INITIAL_STATE,
  assetSourceReducer,
} from "./AssetSourceReducer";
import { updateAssetSources } from "./AssetSourceAction";

import { snackbarReducer } from "./SnackbarReducer";
import {
  showSuccessSnackbar,
  showErrorSnackbar,
  clearSnackbar,
} from "./SnackbarAction";

import { dashboardReducer } from "./DashboardReducer";
import { updateDashboardData } from "./DashboardAction";

import { netWorthReducer } from "./NetWorthReducer";
import { updateNetWorthData } from "./NetWorthAction";

export const Reducer = combineReducers({
  user: userReducer,
  expenses: expenseReducer,
  incomes: incomeReducer,
  workHours: workHourReducer,
  assets: assetReducer,
  liabilities: liabilityReducer,
  expenseGroups: expenseGroupReducer,
  incomeSources: incomeSourceReducer,
  liabilityGroups: liabilityGroupReducer,
  assetSources: assetSourceReducer,
  snackbar: snackbarReducer,
  dashboardData: dashboardReducer,
  netWorthData: netWorthReducer,
});

export {
  USER_INITIAL_STATE,
  EXPENSE_INITIAL_STATE,
  INCOME_INITIAL_STATE,
  WORK_HOUR_INITIAL_STATE,
  ASSET_INITIAL_STATE,
  LIABILITY_INITIAL_STATE,
  EXPENSE_GROUP_INITIAL_STATE,
  INCOME_SOURCE_INITIAL_STATE,
  LIABILITY_GROUP_INITIAL_STATE,
  ASSET_SOURCE_INITIAL_STATE,
  updateUser,
  updateExpenses,
  updateIncomes,
  updateWorkHours,
  updateAssets,
  updateLiabilities,
  updateExpenseGroups,
  updateIncomeSources,
  updateLiabilityGroups,
  updateAssetSources,
  showSuccessSnackbar,
  showErrorSnackbar,
  clearSnackbar,
  updateDashboardData,
  updateNetWorthData,
};
