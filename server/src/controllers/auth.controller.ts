import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import { signToken } from "../utils/jwt";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookie";
import { ApiError } from "../middlewares/error";
import { env } from "../config/env";
import {
  forgotPasswordSchema,
  generateRawToken,
  getExpiryDate,
  hashToken,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema
} from "../validation/auth.schemas";

const toAuthUser = (user: {
  _id: unknown;
  email: string;
  name: string;
  homeLocation?: string;
  isVip: boolean;
  groupId?: unknown;
  emailVerified: boolean;
}) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  homeLocation: user.homeLocation,
  isVip: user.isVip,
  groupId: user.groupId,
  emailVerified: user.emailVerified
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, "Invalid payload", "VALIDATION_ERROR", parsed.error.flatten()));
    return;
  }

  const { email, name, password, homeLocation, isVip } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const existing = await UserModel.findOne({ email: normalizedEmail });
  if (existing) {
    next(new ApiError(409, "Email already exists", "AUTH_EMAIL_EXISTS"));
    return;
  }

  const verificationToken = generateRawToken();
  const user = await UserModel.create({
    email: normalizedEmail,
    name,
    passwordHash: await bcrypt.hash(password, 12),
    homeLocation: homeLocation ?? "",
    isVip: Boolean(isVip),
    emailVerificationTokenHash: hashToken(verificationToken),
    emailVerificationExpiresAt: getExpiryDate(30)
  });

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    emailVerified: user.emailVerified
  });
  setAuthCookie(res, token);

  const data: Record<string, unknown> = {
    token,
    user: toAuthUser(user)
  };

  if (env.exposeAuthTokensInApi) {
    data.verificationToken = verificationToken;
  }

  res.status(201).json({
    success: true,
    message: env.exposeAuthTokensInApi
      ? "Account created. Use verificationToken to confirm email (dev)."
      : "Account created. Check your email to verify your account.",
    data
  });
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, "Invalid payload", "VALIDATION_ERROR", parsed.error.flatten()));
    return;
  }

  const user = await UserModel.findOne({ email: parsed.data.email.toLowerCase() });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    next(new ApiError(401, "Invalid credentials", "AUTH_INVALID_CREDENTIALS"));
    return;
  }

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    emailVerified: user.emailVerified
  });
  setAuthCookie(res, token);
  res.json({
    success: true,
    message: "Signed in successfully.",
    data: {
      token,
      user: toAuthUser(user)
    }
  });
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, "Invalid payload", "VALIDATION_ERROR", parsed.error.flatten()));
    return;
  }

  const user = await UserModel.findOne({ email: parsed.data.email.toLowerCase() });
  const baseMessage = "If this email exists, password reset instructions have been sent.";

  if (!user) {
    res.json({ success: true, message: baseMessage });
    return;
  }

  const resetToken = generateRawToken();
  user.passwordResetTokenHash = hashToken(resetToken);
  user.passwordResetExpiresAt = getExpiryDate(30);
  await user.save();

  const data: Record<string, unknown> = {};
  if (env.exposeAuthTokensInApi) {
    data.resetToken = resetToken;
    if (env.frontendUrl) {
      data.resetLink = `${env.frontendUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(resetToken)}`;
    }
  }

  res.json({
    success: true,
    message: baseMessage,
    ...(Object.keys(data).length ? { data } : {})
  });
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, "Invalid payload", "VALIDATION_ERROR", parsed.error.flatten()));
    return;
  }

  const user = await UserModel.findOne({
    passwordResetTokenHash: hashToken(parsed.data.token),
    passwordResetExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    next(new ApiError(400, "Reset token is invalid or expired", "AUTH_RESET_TOKEN_INVALID"));
    return;
  }

  user.passwordHash = await bcrypt.hash(parsed.data.password, 12);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Password reset successfully."
  });
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = verifyEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, "Invalid payload", "VALIDATION_ERROR", parsed.error.flatten()));
    return;
  }

  const user = await UserModel.findOne({
    emailVerificationTokenHash: hashToken(parsed.data.token),
    emailVerificationExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    next(new ApiError(400, "Verification token is invalid or expired", "AUTH_VERIFY_TOKEN_INVALID"));
    return;
  }

  user.emailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpiresAt = undefined;
  await user.save();

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    emailVerified: user.emailVerified
  });
  setAuthCookie(res, token);
  res.json({
    success: true,
    message: "Email verified successfully.",
    data: {
      token,
      user: toAuthUser(user)
    }
  });
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = await UserModel.findById(req.user!.userId);
  if (!user) {
    next(new ApiError(404, "User not found", "USER_NOT_FOUND"));
    return;
  }

  res.json({
    success: true,
    data: { user: toAuthUser(user) }
  });
};

export const logout = (_req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.json({
    success: true,
    message: "Signed out."
  });
};
