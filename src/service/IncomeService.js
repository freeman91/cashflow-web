import axios from 'axios';
import API_HOST from '../helpers/api_host.js';

const getSources = async function (auth_token) {
  return axios
    .get(API_HOST + '/income_sources', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

const create = async function (income, auth_token) {
  return axios
    .post(API_HOST + '/incomes', {
      headers: { Authorization: auth_token },
      params: {
        amount: income.amount,
        source: income.source,
        date: income.date,
        description: income.description,
      },
    })
    .catch((error) => console.log(error));
};

const _delete = async function (id, auth_token) {
  return axios.delete(API_HOST + '/incomes', {
    headers: { Authorization: auth_token },
    params: {
      id: id,
    },
  });
};

const edit = async function (income, auth_token) {
  return axios
    .put(API_HOST + '/incomes/update', {
      headers: { Authorization: auth_token },
      params: {
        id: income.id,
        amount: income.amount,
        source: income.source,
        vendor: income.vendor,
        date: income.date,
        description: income.description,
      },
    })
    .catch((error) => console.log(error));
};

export default {
  getSources,
  create,
  _delete,
  edit,
};
