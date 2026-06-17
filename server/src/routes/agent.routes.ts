import { Router } from "express";
import rateLimit from "express-rate-limit";
import { slowDown } from "express-slow-down";
import { optionalAuth } from "../middlewares/auth";
import { postAgentChat } from "../controllers/agent.controller";

const router = Router();

const agentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, code: "RATE_LIMIT", message: "Too many AI requests" }
});

const agentSlow = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 4,
  delayMs: () => 400,
  maxDelayMs: 8000
});

router.post("/chat", agentLimiter, agentSlow, optionalAuth, postAgentChat);

export default router;
