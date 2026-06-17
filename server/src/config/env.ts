import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUrl: process.env.MONGO_URL || "",
  dbName: process.env.DB_NAME || "homefood",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  /** Public web app URL (e.g. https://app.example.com) — used for reset links when exposing tokens in dev */
  frontendUrl: (process.env.FRONTEND_URL || "").replace(/\/$/, ""),
  /**
   * When true, register / forgot-password responses include raw tokens for local testing.
   * Defaults to true in development, false in production.
   */
  exposeAuthTokensInApi:
    process.env.EXPOSE_AUTH_TOKENS_IN_API === "true" ||
    (process.env.EXPOSE_AUTH_TOKENS_IN_API !== "false" && nodeEnv !== "production"),
  /** OpenAI API key for the ordering assistant (`/api/agent/chat`). */
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  /** Chat model id (OpenAI), e.g. gpt-4o-mini */
  aiModel: process.env.AI_MODEL || "gpt-4o-mini",
  nodeEnv
};

if (!env.mongoUrl) {
  throw new Error("MONGO_URL is missing. Set it in your environment.");
}
