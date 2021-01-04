import axios from "axios";
const API_HOST = process.env.REACT_APP_API_HOST;

const getData = async function (auth_token, year) {
  return axios
    .get(API_HOST + "/year/data", {
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
