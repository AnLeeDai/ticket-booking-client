import axios from "axios";

import { getToken, getTokenType, removeToken } from "@/utils/local-storage";
import { pageRoute } from "@/configs/site-config";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor - Add token to headers
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    const tokenType = getTokenType();

    if (token) {
      config.headers.Authorization = `${tokenType || "Bearer"} ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token expiration
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Unauthenticated."
    ) {
      removeToken();
      window.location.href = pageRoute.login;
    }

    // Transform error to include API message
    const apiError = {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Đã có lỗi xảy ra. Vui lòng thử lại.",
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  },
);

export default instance;
