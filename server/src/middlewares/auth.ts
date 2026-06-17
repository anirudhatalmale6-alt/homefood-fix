import { NextFunction, Request, Response } from "express";
import { TokenOrigin, verifyToken } from "../utils/jwt";
import { AUTH_COOKIE_NAME } from "../utils/authCookie";
import { ApiError } from "./error";

const inferTokenOrigin = (req: Request): TokenOrigin => {
  const hint = (req.get("referer") || req.get("origin") || "").toLowerCase();
  if (hint.includes("/api/docs") || hint.includes("swagger")) {
    return "console";
  }
  return "web";
};

const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim() || null;
  }

  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
  return typeof cookieToken === "string" && cookieToken.length > 0 ? cookieToken : null;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    next(new ApiError(401, "Unauthorized", "AUTH_MISSING_TOKEN"));
    return void 0;
  }

  try {
    req.user = verifyToken(token, { origin: inferTokenOrigin(req) });
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid token", "AUTH_INVALID_TOKEN", error));
  }
};

/** Sets `req.user` when a valid Bearer/cookie token is present; otherwise continues without error. */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);
  if (!token) {
    next();
    return void 0;
  }
  try {
    req.user = verifyToken(token, { origin: inferTokenOrigin(req) });
  } catch {
    // ignore invalid token for guest flows
  }
  next();
};
