import axios from 'axios';
const API_HOST = process.env.REACT_APP_API_HOST;

const getGroups = async function (auth_token) {
  return axios
    .get(API_HOST + '/debt_groups', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const getFromMonth = async function (month, year, auth_token) {
  return axios
    .post(API_HOST + '/debts/month', {
      headers: { Authorization: auth_token },
      params: {
        month,
        year,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const create = async function (asset, auth_token) {
  return axios
    .post(API_HOST + '/debts', {
      headers: { Authorization: auth_token },
      params: {
        amount: asset.amount,
        group: asset.group,
        description: asset.description,
        date: asset.date,
      },
    })
    .catch((error) => console.error(error));
};

const destroy = async function (id, auth_token) {
  return axios.delete(API_HOST + '/debts', {
    headers: { Authorization: auth_token },
    params: {
      id: id,
    },
  });
};

const update = async function (asset, auth_token) {
  return axios
    .put(API_HOST + '/debts/update', {
      headers: { Authorization: auth_token },
      params: {
        id: asset.id,
        amount: asset.amount,
        group: asset.group,
        description: asset.description,
        date: asset.date,
      },
    })
    .catch((error) => console.error(error));
};

export default {
  getFromMonth,
  getGroups,
  create,
  destroy,
  update,
};
