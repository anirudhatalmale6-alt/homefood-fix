import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface IUserJwtPayload {
  userId: string;
  email: string;
  emailVerified: boolean;
}

const TOKEN_ISSUER = "homefood-server";
const TOKEN_AUDIENCE_WEB = "homefood-web";

export type TokenOrigin = "web" | "console";

export interface VerifyContext {
  origin?: TokenOrigin;
}

export const signToken = (payload: IUserJwtPayload): string =>
  jwt.sign(payload, env.jwtSecret, {
    expiresIn: "2h",
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE_WEB
  });

export const verifyToken = (
  token: string,
  _ctx: VerifyContext = {}
): IUserJwtPayload =>
  jwt.verify(token, env.jwtSecret, {
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE_WEB
  }) as IUserJwtPayload;
