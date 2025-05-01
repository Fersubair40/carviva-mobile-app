import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const request = axios.create({
  baseURL: 'https://carviva-fuelwallet-api-production.up.railway.app',
});

request.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

request.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const token = await SecureStore.getItemAsync('token');
    if (error.response?.status === 401 && token) {
      await SecureStore.deleteItemAsync('token');
      router.replace('/login');
    }

    return Promise.reject(error);
  }
);

export default request;
