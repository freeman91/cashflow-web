import axios from 'axios';
const API_HOST = process.env.REACT_APP_API_HOST;

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

const getChartData = async function (auth_token, startDate, endDate) {
  return axios
    .get(API_HOST + '/month/pie-chart', {
      headers: { Authorization: auth_token },
      params: {
        startDate,
        endDate,
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
  getChartData,
};
