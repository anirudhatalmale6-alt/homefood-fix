import crypto from "node:crypto";
import { z } from "zod";

const passwordField = z.string().min(6, { message: "Password must be at least 6 characters" }).max(64);

export const registerSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(80),
  password: passwordField,
  homeLocation: z.string().trim().max(120).optional(),
  isVip: z.boolean().optional()
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6)
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(20),
  password: passwordField
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(20)
});

export const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const generateRawToken = (): string => crypto.randomBytes(32).toString("hex");

export const getExpiryDate = (minutes: number): Date => new Date(Date.now() + minutes * 60 * 1000);
