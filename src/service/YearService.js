import axios from 'axios';
import API_HOST from '../helpers/api-host.js';

const getData = async function (auth_token, year) {
  return axios
    .get(API_HOST + '/year/data', {
      headers: { Authorization: auth_token },
      params: {
        year,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

export default {
  getData,
};
