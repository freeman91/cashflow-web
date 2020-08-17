import axios from 'axios';
const API_HOST = process.env.REACT_APP_API_HOST;

const create = async function (newGroup, auth_token) {
  return axios.post(API_HOST + '/expense_groups', {
    headers: { Authorization: auth_token },
    params: {
      name: newGroup.name,
      description: newGroup.description,
    },
  });
};

const destroy = async function (id, auth_token) {
  return axios.delete(API_HOST + '/expense_groups', {
    headers: { Authorization: auth_token },
    params: {
      id: id,
    },
  });
};

const getGroups = async function (auth_token) {
  return axios
    .get(API_HOST + '/expense_groups/all', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const update = async function (expenseGroup, auth_token) {
  return axios
    .post(API_HOST + '/expense_groups/update', {
      headers: { Authorization: auth_token },
      params: {
        id: expenseGroup.id,
        name: expenseGroup.name,
        description: expenseGroup.description,
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
