import type { AxiosInstance } from 'axios';
import axios, { AxiosHeaders } from 'axios';
import '../types/axios.ts';

class Http {
  axiosIntance: AxiosInstance;
  constructor() {
    this.axiosIntance = axios.create({
      baseURL: 'http://localhost:3000/api/',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });

    // execute before request is sent
    this.axiosIntance.interceptors.request.use(
      function (config) {
        if (config.skipAuth) {
          return config; // add header skipAuth for public endpoint
        }

        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers = config.headers || new AxiosHeaders();
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      function (error) {
        console.log('Axios request interceptor error: ', error);
        return Promise.reject(error);
      },
    );

    this.axiosIntance.interceptors.response.use(
      function onFullfilled(response) {
        if (response.config.url === 'auth/login' || response.config.url === 'auth/register') {
          const { access_token, refresh_token } = response.data.data;
          if (access_token) {
            localStorage.setItem('access_token', access_token);
          }

          if (refresh_token) {
            localStorage.setItem('refresh_token', refresh_token);
          }

          // redirect dashboard after login or register
        }
        // if (!response.data.success) {
        //   return Promise.reject('Something went wrongs')
        // }
        const apiData = response.data.data;
        // pagination
        if (apiData?.result !== undefined) {
          return apiData;
        }

        // no pagination -> wrap
        return {
          result: apiData,
        };
      },
      async (error) => {
        const originalConfig = error.config;
        const url = originalConfig?.url;

        const isAuthEndpoint = url === 'auth/login' || url === 'auth/register' || url === 'auth/refresh';

        if (error.response.status === 401 && !originalConfig._retry && !isAuthEndpoint) {
          originalConfig._retry = true;
          const refreshTokenFromStorage = localStorage.getItem('refresh_token');

          try {
            const result = await this.axiosIntance.post<
              unknown,
              {
                result: {
                  access_token: string;
                };
              }
            >(
              'auth/refresh',
              {
                token: refreshTokenFromStorage,
              },
              { skipAuth: true },
            );

            const newAccessToken = result.result.access_token;
            localStorage.setItem('access_token', newAccessToken);
            originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;

            return this.axiosIntance(originalConfig);
          } catch (errorFromRetry) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            return Promise.reject(errorFromRetry);
          }
        }
        console.log('Response errror: ', error.response);
        return Promise.reject(error);
      },
    );
  }
}

export const http = new Http().axiosIntance;
