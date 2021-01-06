import axios from "axios";
const API_HOST = process.env.REACT_APP_API_HOST;

const create = async function (email, password) {
  return axios
    .post(API_HOST + "/sessions", {
      email: email,
      password: password,
      timeout: 10000,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => console.error(error));
};

const tokenValid = async function (token) {
  return axios
    .get(API_HOST + "/sessions", {
      headers: { Authorization: token },
    })
    .then((_) => {
      return "VALID";
    })
    .catch((error) => {
      console.error(error);
      return "INVALID";
    });
};

export default {
  create,
  tokenValid,
};
