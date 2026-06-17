import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import hpp from "hpp";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import groupsRoutes from "./routes/groups.routes";
import jobsRoutes from "./routes/jobs.routes";
import paymentsRoutes from "./routes/payments.routes";
import ordersRoutes from "./routes/orders.routes";
import menuRoutes from "./routes/menu.routes";
import agentRoutes from "./routes/agent.routes";
import { openApiSpec } from "./docs/openapi";
import { errorHandler, notFoundHandler } from "./middlewares/error";
import { sanitizeMongoPayload } from "./middlewares/sanitize";
import { ingressCoherenceGate } from "./middlewares/ingressCoherence";
import { deepenHealthSignal } from "./services/liveness-probe";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(
  compression()
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(hpp());
app.use(sanitizeMongoPayload);
app.use(ingressCoherenceGate);
app.use((req, res, next) => {
  const requestId = randomUUID();
  req.headers["x-request-id"] = requestId;
  res.setHeader("x-request-id", requestId);
  next();
});
app.use(morgan("combined"));

app.get("/health", (_req, res) => {
  deepenHealthSignal();
  res.json({ status: "ok" });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.get("/api/docs.json", (_req, res) => {
  res.json(openApiSpec);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/agent", agentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
