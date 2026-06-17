import { NextFunction, Request, Response } from "express";

const sanitizeObject = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};

    for (const [key, childValue] of Object.entries(record)) {
      const cleanKey = key.replace(/\$/g, "").replace(/\./g, "");
      sanitized[cleanKey] = sanitizeObject(childValue);
    }

    return sanitized;
  }

  return value;
};

export const sanitizeMongoPayload = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  next();
};
