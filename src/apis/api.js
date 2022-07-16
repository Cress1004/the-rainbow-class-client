import axios from "axios";
import { SERVER_API_URL } from "../config";

const axiosClient = axios.create({
  baseURL: `${SERVER_API_URL}`,
  responseType: "json",
  timeout: 15 * 1000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    cookies: document.cookies,
  },
});

axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosClient;
