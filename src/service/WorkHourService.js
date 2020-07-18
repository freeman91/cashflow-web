import axios from 'axios';
import API_HOST from '../helpers/api_host.js';

const create = async function (workHour, auth_token) {
  return axios
    .post(API_HOST + '/work_hours', {
      headers: { Authorization: auth_token },
      params: {
        amount: workHour.amount,
        source: workHour.source,
        date: workHour.date,
      },
    })
    .catch((error) => console.error(error));
};

const destroy = async function (id, auth_token) {
  return axios.delete(API_HOST + '/work_hours', {
    headers: { Authorization: auth_token },
    params: {
      id: id,
    },
  });
};

const edit = async function (workHour, auth_token) {
  return axios
    .put(API_HOST + '/work_hours/update', {
      headers: { Authorization: auth_token },
      params: {
        id: workHour.id,
        amount: workHour.amount,
        source: workHour.source,
        date: workHour.date,
      },
    })
    .catch((error) => console.error(error));
};

export default {
  create,
  destroy,
  edit,
};
