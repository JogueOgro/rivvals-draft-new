import { HostService } from '@/services/host.service';

import axios from 'axios';

const api = axios.create({
  baseURL: HostService.getApiHost(),
  timeout: 17000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  return config;
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default api;
