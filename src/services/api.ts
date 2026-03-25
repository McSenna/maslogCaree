import axios from 'axios';
import api from './api';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if(!apiUrl) {
    throw new Error('API URL is not defined in environment variables');
  }

const baseApi = apiUrl.replace(/\/+$/, ''); 

export const apiRouting = baseApi ? baseApi : `${baseApi}/api`;

const apiClient = axios.create({
  baseURL: apiRouting,
  timeout:15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;