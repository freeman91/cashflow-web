import axios from 'axios';
import API_HOST from '../helpers/api-host.js';

const create = async function (newGroup, auth_token) {
  return axios.post(API_HOST + '/debt_groups', {
    headers: { Authorization: auth_token },
    params: {
      name: newGroup.name,
      description: newGroup.description,
    },
  });
};

const destroy = async function (id, auth_token) {
  return axios.delete(API_HOST + '/debt_groups', {
    headers: { Authorization: auth_token },
    params: {
      id: id,
    },
  });
};

const getGroups = async function (auth_token) {
  return axios
    .get(API_HOST + '/debt_groups/all', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const update = async function (debtGroup, auth_token) {
  return axios
    .post(API_HOST + '/debt_groups/update', {
      headers: { Authorization: auth_token },
      params: {
        id: debtGroup.id,
        name: debtGroup.name,
        description: debtGroup.description,
      },
    })
    .catch((error) => console.log(error));
};

export default {
  create,
  destroy,
  getGroups,
  update,
};
