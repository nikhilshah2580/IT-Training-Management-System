import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshRequest = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes(
      "/users/refresh-token",
    );

    if (status !== 401 || originalRequest?._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshRequest = refreshRequest || api.post("/users/refresh-token");
      await refreshRequest;
      refreshRequest = null;
      return api(originalRequest);
    } catch (refreshError) {
      refreshRequest = null;
      return Promise.reject(refreshError);
    }
  },
);

export default api;
