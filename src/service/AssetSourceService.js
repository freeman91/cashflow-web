import axios from 'axios';
const API_HOST = process.env.REACT_APP_API_HOST;

const create = async function (newSources, auth_token) {
  return axios.post(API_HOST + '/property_sources', {
    headers: { Authorization: auth_token },
    params: {
      name: newSources.name,
      description: newSources.description,
    },
  });
};

const destroy = async function (id, auth_token) {
  return axios.delete(API_HOST + '/property_sources', {
    headers: { Authorization: auth_token },
    params: {
      id: id,
    },
  });
};

const getSources = async function (auth_token) {
  return axios
    .get(API_HOST + '/property_sources/all', {
      headers: { Authorization: auth_token },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
};

const update = async function (assetSource, auth_token) {
  return axios
    .post(API_HOST + '/property_sources/update', {
      headers: { Authorization: auth_token },
      params: {
        id: assetSource.id,
        name: assetSource.name,
        description: assetSource.description,
      },
    })
    .catch((error) => console.error(error));
};

export default {
  create,
  destroy,
  getSources,
  update,
};
