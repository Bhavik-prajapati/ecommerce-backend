import axios from "axios";
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // your base API URL
  withCredentials: true, // include cookies/auth if needed
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
