// import axios from 'axios';

// console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   timeout: 50000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token"); 
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // // INTERCEPTOR: log request headers trước khi gửi
// // axiosInstance.interceptors.request.use((config) => {
// //   console.log("Request URL:", config.url);
// //   console.log("Request Headers:", config.headers);
// //   return config;
// // }, (error) => {
// //   return Promise.reject(error);
// // });

// export default axiosInstance;

import axios from 'axios';

console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

/**
 * Mở rộng Axios config để cho phép requireAuth
 */
declare module 'axios' {
  export interface AxiosRequestConfig {
    requireAuth?: boolean;
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor: CHỈ gắn token khi requireAuth = true
 */
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.requireAuth) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
