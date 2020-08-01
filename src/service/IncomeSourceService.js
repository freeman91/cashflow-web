import axios from 'axios';
import API_HOST from '../helpers/api-host.js';

const create = async function (newSources, auth_token) {
  return axios.post(API_HOST + '/income_sources', {
    headers: { Authorization: auth_token },
    params: {
      name: newSources.name,
      description: newSources.description,
    },
  });
};

const destroy = async function (id, auth_token) {
  return axios.delete(API_HOST + '/income_sources', {
    headers: { Authorization: auth_token },
    params: {
      id: id,
    },
  });
};

const getSources = async function (auth_token) {
  return axios
    .get(API_HOST + '/income_sources/all', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const update = async function (incomeSource, auth_token) {
  return axios
    .post(API_HOST + '/income_sources/update', {
      headers: { Authorization: auth_token },
      params: {
        id: incomeSource.id,
        name: incomeSource.name,
        description: incomeSource.description,
      },
    })
    .catch((error) => console.log(error));
};

export default {
  create,
  destroy,
  getSources,
  update,
};
