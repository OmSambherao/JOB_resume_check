import axios from "axios";

const api = axios.create({
  // Use the Vite environment variable for the base URL.
  // Fallback to the local backend URL for development.
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true, // This is crucial for sending cookies
});

export default api;
