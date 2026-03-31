import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const analyzeCode = (code: string) => {
  return API.post("/api/analyze", { code });
};

export const getHistory = () => {
  return API.get("/api/analyze/history");
};

export const clearHistory = () => {
  return API.delete("/api/analyze/history");
};