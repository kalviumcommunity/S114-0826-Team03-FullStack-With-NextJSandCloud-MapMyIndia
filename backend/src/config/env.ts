import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["MONGODB_URI"];

for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI as string,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};