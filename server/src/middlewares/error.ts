import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, code = "API_ERROR", details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(404, "Route not found"));
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = req.headers["x-request-id"];

  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: error.message,
      statusCode: error.statusCode,
      details: error.details || error.error,
      requestId
    });
    return;
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    code: error instanceof ApiError ? error.code : "INTERNAL_SERVER_ERROR",
    message: error.message || "Internal server error",
    details: error instanceof ApiError ? error.details : undefined,
    requestId
  });
};
