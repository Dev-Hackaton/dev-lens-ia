import "dotenv/config";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is required");
}

export const ENV = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY.trim(),
  FRONTEND_URL: process.env.FRONTEND_URL,
};