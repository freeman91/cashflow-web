import axios from 'axios';
import API_HOST from '../helpers/api_host.js';

const getData = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/data', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

const getExpenses = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/expenses', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

const getIncomes = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/incomes', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

const getWorkHours = async function (auth_token) {
  return axios
    .get(API_HOST + '/dashboard/work_hours', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

export default {
  getData,
  getExpenses,
  getIncomes,
  getWorkHours,
};
