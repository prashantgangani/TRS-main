export const API_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL || "http://localhost:5000"
  : "https://trs-main.onrender.com";
export const API_URL = `${API_BASE_URL}/api`;
