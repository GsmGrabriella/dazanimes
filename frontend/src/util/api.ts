// importa as dependências necessárias
import axios from "axios";

// define a baseURL da API
const api = axios.create({
  baseURL: "http://localhost:3333"
});

export default api;