import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  // Browser must set multipart boundary itself
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    if (config.headers && "Content-Type" in config.headers) {
      delete config.headers["Content-Type"];
    }
  }
  return config;
});

type RetryConfig = AxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;

    if (error.response?.status === 401 && typeof window !== "undefined" && config) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken && !config._retry) {
        try {
          config._retry = true;
          const refreshed = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const payload = refreshed.data?.data ?? refreshed.data;
          if (payload?.accessToken) {
            localStorage.setItem("auth_token", payload.accessToken);
            if (payload.refreshToken) {
              localStorage.setItem("refresh_token", payload.refreshToken);
            }
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${payload.accessToken}`;
            return api.request(config);
          }
        } catch {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
        }
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
      }
    }
    return Promise.reject(error);
  }
);

/** Unwrap NestJS `{ success, data, message }` envelope */
export function unwrapData<T>(response: AxiosResponse): T {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return body.data as T;
  }
  return body as T;
}

export default api;
