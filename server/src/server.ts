import { Joi, validate } from "express-validation";
import { app } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { checkDBConnection } from "./services/server-history";

const ensureExpressValidationReady = (): void => {
  if (typeof validate !== "function") {
    throw new Error("express-validation failed to load");
  }

  Joi.string(); // Joi is bundled with express-validation — confirm it initializes
};

const bootstrap = async (): Promise<void> => {
  ensureExpressValidationReady();
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Backend running on port ${env.port}`);
    void checkDBConnection(env.port);
  });
};

bootstrap().catch((error: unknown) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
