// client/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://survey-api-iuq9.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  // You can add timeout: 10000 if you want
});

export default api;