import axios from "axios";
import { BASE_URL } from "./constants";

let accessToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout for slow Render cold starts
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

const refreshApi = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.headers.Authorization &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await refreshApi.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );
        const newAccessToken = response.data.data.access_token;
        setAuthToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        window.dispatchEvent(new Event("auth-error"));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const verifyAlumniCode = async (code: string) => {
  return api.post("/alumni/verify-code", { code });
};

export const checkAlumniManual = async (data: {
  name: string;
  roll_no?: string;
  batch: string;
  branch: string;
  contact_info?: {
    phone?: string;
    alternate_email?: string;
    linkedin?: string;
  };
}) => {
  return api.post("/alumni/check-manual", data);
};

export const confirmAlumniMatch = async (payload: { roll_no: string }) => {
  return api.post("/alumni/confirm-match", payload);
};

export const getUserProfile = async () => {
  return api.get("/profile");
};

export const searchUsers = async (query: string) => {
  return api.get(`/profile/search?name=${encodeURIComponent(query)}&limit=5`);
};

export default api;
