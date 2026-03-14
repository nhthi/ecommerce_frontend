import axios, { InternalAxiosRequestConfig } from "axios";

export const API_URL = "http://localhost:9090";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sellerApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// sellerApi
sellerApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("jwt_seller");

    if (token) {
      // Axios v1: headers là AxiosHeaders -> dùng set
      config.headers.set?.("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// api (client chung)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("jwt");

    if (token) {
      config.headers.set?.("Authorization", `Bearer ${token}`);
      // Nếu muốn chắc cú hơn (trường hợp headers chưa phải AxiosHeaders):
      // (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
