import axios from "axios";

const backendAPI = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_ENDPOINT,
  timeout: 30000,
});

//Interceptors
backendAPI.interceptors.request.use(
  async (config) => {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
//return data from each response and reject in case of error which will trigger ModalError
backendAPI.interceptors.response.use(
  (response) => {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

async function getBusesForStop(stopid) {
  return backendAPI.get("/stop/"+stopid);
}

export {
    getBusesForStop
};
