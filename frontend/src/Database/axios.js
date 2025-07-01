 
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "https://chating-app-message.onrender.com/api",
  withCredentials: true, // ✅ REQUIRED to send/receive cookies
  headers: {
    "Content-Type": "application/json"
  }
});
