import axios from 'axios';
import API_HOST from '../helpers/api_host.js';

const getSources = async function (auth_token) {
  return axios
    .get(API_HOST + '/property_sources', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const getFromMonth = async function (month, year, auth_token) {
  return axios
    .post(API_HOST + '/properties/month', {
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
    .post(API_HOST + '/properties', {
      headers: { Authorization: auth_token },
      params: {
        amount: asset.amount,
        source: asset.source,
        description: asset.description,
        date: asset.date,
      },
    })
    .catch((error) => console.error(error));
};

const destroy = async function (id, auth_token) {
  return axios.delete(API_HOST + '/properties', {
    headers: { Authorization: auth_token },
    params: {
      id: id,
    },
  });
};

const update = async function (asset, auth_token) {
  return axios
    .put(API_HOST + '/properties/update', {
      headers: { Authorization: auth_token },
      params: {
        id: asset.id,
        amount: asset.amount,
        source: asset.source,
        description: asset.description,
        date: asset.date,
      },
    })
    .catch((error) => console.error(error));
};

export default {
  getFromMonth,
  getSources,
  create,
  destroy,
  update,
};
