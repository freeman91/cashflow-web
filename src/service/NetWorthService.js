import axios from "axios";
const API_HOST = process.env.REACT_APP_API_HOST;

const getData = async function (auth_token, month, year) {
  return axios
    .get(API_HOST + "/networth/data", {
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

const getAssets = async function (auth_token, month, year) {
  return axios
    .get(API_HOST + "/networth/properties", {
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

const getLiabilities = async function (auth_token, month, year) {
  return axios
    .get(API_HOST + "/networth/debts", {
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

export default {
  getData,
  getLiabilities,
  getAssets,
};
