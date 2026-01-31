import axios from "axios";
import { getApiBaseUrl } from "./api";

export const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});
