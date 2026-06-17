import { Response } from "express";

export const AUTH_COOKIE_NAME = "homefood_session";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

const isProd = process.env.NODE_ENV === "production";

/**
 * httpOnly session cookie carrying the JWT.
 *
 * Why httpOnly: prevents JavaScript (and any XSS injection) from reading the
 * token, eliminating an entire class of token-theft attacks that affect
 * localStorage-based sessions.
 *
 * SameSite=Lax + Secure (in prod) protects against CSRF while still allowing
 * normal top-level navigations to authenticated pages.
 */
export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: TWO_HOURS_MS
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/"
  });
};
