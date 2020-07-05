import axios from 'axios';
import API_HOST from '../helpers/api_host.js';

const create = async function (email, password) {
  return axios
    .post(API_HOST + '/sessions', {
      email: email,
      password: password,
      timeout: 10000,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => console.error(error));
};

const _delete = async function (auth_token) {
  return axios
    .get(API_HOST + '/sessions', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      console.log('Session ended');
    })
    .catch((error) => console.error(error));
};

export default {
  create,
  _delete,
};
