import axios from 'axios';

let accessToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: 'https://nalum-p4wh.onrender.com',
});

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest.headers.Authorization && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post('https://nalum-p4wh.onrender.com/auth/refresh', {}, { withCredentials: true });
        const newAccessToken = response.data.data.access_token;
        setAuthToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;