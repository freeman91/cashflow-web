import axios from 'axios';
const API_HOST = process.env.REACT_APP_API_HOST;

const getData = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/data', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const getExpenseSum = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/expense_sum', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const getIncomeSum = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/income_sum', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const getWorkHourSum = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/work_hour_sum', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const getExpenses = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/expenses', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const getIncomes = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/incomes', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const getWorkHours = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/work_hours', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const getPercentIncome = async function (auth_token, end, start) {
  return axios
    .get(API_HOST + '/dashboard/percent_income', {
      headers: { Authorization: auth_token },
      params: {
        start,
        end,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

export default {
  getData,
  getExpenseSum,
  getIncomeSum,
  getWorkHourSum,
  getExpenses,
  getIncomes,
  getWorkHours,
  getPercentIncome,
};
