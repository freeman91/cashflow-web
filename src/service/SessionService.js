import axios from 'axios';
const API_HOST = process.env.REACT_APP_API_HOST;

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

const destroy = async function (auth_token) {
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
  destroy,
};
