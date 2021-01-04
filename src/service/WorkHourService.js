import axios from "axios";
const API_HOST = process.env.REACT_APP_API_HOST;

const create = async function (workHour, auth_token) {
  return axios
    .post(API_HOST + "/work_hours", {
      headers: { Authorization: auth_token },
      params: {
        amount: workHour.amount,
        source: workHour.source,
        date: workHour.date,
      },
    })
    .catch((error) => console.error(error));
};

const getMonthData = async function (auth_token, month, year) {
  return axios
    .get(API_HOST + "/work_hours/month", {
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

const destroy = async function (id, auth_token) {
  return axios.delete(API_HOST + "/work_hours", {
    headers: { Authorization: auth_token },
    params: {
      id: id,
    },
  });
};

const edit = async function (workHour, auth_token) {
  return axios
    .put(API_HOST + "/work_hours/update", {
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
  getMonthData,
  create,
  destroy,
  edit,
};
