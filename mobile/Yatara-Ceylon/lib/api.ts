import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
export const TOKEN_KEY = 'yatara_mobile_token';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return 'Something went wrong';
}
