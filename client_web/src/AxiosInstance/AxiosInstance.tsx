import axios, { AxiosInstance } from 'axios';

const axiosAPIInstanceProject: AxiosInstance = axios.create({
  baseURL: process.env.BASEURL
});

// Add a response interceptor to handle errors
axiosAPIInstanceProject.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('Error code:', error.code);

    if (error.code === 'ERR_NETWORK') {
      // Navigate to a specific route for maintenance
      window.location.href = '/status/maintenance';
    } else {
      // Log other errors to the console
      console.error('Axios error:', error);
    }
    return Promise.reject(error);
  }
);


// Add a request interceptor to attach the Authorization header
axiosAPIInstanceProject.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosAPIInstanceProject;
