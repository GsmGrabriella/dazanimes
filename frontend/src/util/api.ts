// importa as dependências necessárias
import axios from "axios";

// define a baseURL da API
const api = axios.create({
  baseURL: "http://localhost:3333",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (user) {
      config.headers.User = user;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;