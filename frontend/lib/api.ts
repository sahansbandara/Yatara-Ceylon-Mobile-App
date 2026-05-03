import axios from 'axios';

import { getStoredToken, TOKEN_KEY } from './tokenStorage';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
export { TOKEN_KEY };

export const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

api.interceptors.request.use(async (config) => {
  const token = await getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return `The API did not respond in time. Check that ${API_URL} is online and reachable from this device.`;
    }
    if (error.code === 'ERR_NETWORK') {
      return `Cannot reach the API at ${API_URL}. Check your internet connection or backend URL.`;
    }
    return error.response?.data?.error || error.message;
  }
  return 'Something went wrong';
}
