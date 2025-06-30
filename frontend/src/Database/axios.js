import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "https://chating-app-message.onrender.com/api", // ✅ LIVE backend URL
  withCredentials: true,
});
