import axios from 'axios';
import API_HOST from '../helpers/api_host.js';

const getData = async function (auth_token) {
  return axios
    .get(API_HOST + '/year/data', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

export default {
  getData,
};
