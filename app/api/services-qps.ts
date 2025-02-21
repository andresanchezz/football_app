import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import { useAuthStore } from '../state';

export const apiServices = axios.create({
  baseURL: "https://apisports-y4oo.onrender.com/api/v1"
})

apiServices.interceptors.request.use(async function (config) {
  const { token } = useAuthStore.getState()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config;
}, function (error) {
  if (error.response) {
    //TODO: here it means we should handle a toast
  }
  return Promise.reject(error)
})

apiServices.interceptors.response.use(function (response) {
  return response;
}, async function (error) {
  if (error.response) {
    await SecureStore.deleteItemAsync('userToken');
  }
  return Promise.reject(error)
})
