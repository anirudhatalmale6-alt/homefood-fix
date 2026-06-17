import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth, optionalAuth } from "../middlewares/auth";
import { createOrder, getMyOrder, listMyOrders } from "../controllers/order.controller";

const router = Router();

const orderCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, code: "RATE_LIMIT", message: "Too many orders from this IP" }
});

router.post("/", orderCreateLimiter, optionalAuth, createOrder);
router.get("/me", requireAuth, listMyOrders);
router.get("/me/:orderId", requireAuth, getMyOrder);

export default router;
