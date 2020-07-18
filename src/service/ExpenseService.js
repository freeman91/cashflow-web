import axios from 'axios';
import API_HOST from '../helpers/api_host.js';

const getGroups = async function (auth_token) {
  return axios
    .get(API_HOST + '/expense_groups', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const create = async function (expense, auth_token) {
  return axios
    .post(API_HOST + '/expenses', {
      headers: { Authorization: auth_token },
      params: {
        amount: expense.amount,
        group: expense.group,
        vendor: expense.vendor,
        date: expense.date,
        description: expense.description,
        bill: expense.bill,
      },
    })
    .catch((error) => console.error(error));
};

const _delete = async function (id, auth_token) {
  return axios.delete(API_HOST + '/expenses', {
    headers: { Authorization: auth_token },
    params: {
      id: id,
    },
  });
};

const edit = async function (expense, auth_token) {
  return axios
    .put(API_HOST + '/expenses/update', {
      headers: { Authorization: auth_token },
      params: {
        id: expense.id,
        amount: expense.amount,
        group: expense.group,
        vendor: expense.vendor,
        date: expense.date,
        bill: expense.bill,
        description: expense.description,
      },
    })
    .catch((error) => console.error(error));
};

export default {
  getGroups,
  create,
  _delete,
  edit,
};
