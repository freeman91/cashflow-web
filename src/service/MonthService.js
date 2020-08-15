import axios from 'axios';
import API_HOST from '../helpers/api-host.js';

const getData = async function (auth_token, week, year) {
  return axios
    .get(API_HOST + '/month/data', {
      headers: { Authorization: auth_token },
      params: {
        week,
        year,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const getBills = async function (auth_token, week, year) {
  return axios
    .get(API_HOST + '/month/bills', {
      headers: { Authorization: auth_token },
      params: {
        week,
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
  getBills,
};
