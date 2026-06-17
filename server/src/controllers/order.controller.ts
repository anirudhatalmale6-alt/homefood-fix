import { NextFunction, Request, Response } from "express";
import { ApiError } from "../middlewares/error";
import { optionalAuth } from "../middlewares/auth";
import { createOrderSchema } from "../validation/order.schemas";
import { createOrderRecord, getOrderForUser, listOrdersForUser, toOrderResponse } from "../services/order.service";

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, "Invalid order payload", "VALIDATION_ERROR", parsed.error.flatten()));
    return void 0;
  }

  try {
    const doc = await createOrderRecord(parsed.data, { userId: req.user?.userId, source: "web" });
    res.status(201).json({
      success: true,
      message: "Order received. We will confirm by email or phone.",
      data: { order: toOrderResponse(doc) }
    });
  } catch (e) {
    next(e);
  }
};

export const listMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    next(new ApiError(401, "Unauthorized", "AUTH_MISSING_TOKEN"));
    return void 0;
  }
  try {
    const orders = await listOrdersForUser(req.user.userId);
    res.json({ success: true, data: { orders } });
  } catch (e) {
    next(e);
  }
};

export const getMyOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    next(new ApiError(401, "Unauthorized", "AUTH_MISSING_TOKEN"));
    return void 0;
  }
  const raw = req.params.orderId;
  const orderId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
  if (!orderId) {
    next(new ApiError(400, "Invalid order id", "ORDER_INVALID_ID"));
    return void 0;
  }
  try {
    const order = await getOrderForUser(orderId, req.user.userId);
    res.json({ success: true, data: { order } });
  } catch (e) {
    next(e);
  }
};
