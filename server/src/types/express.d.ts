import { IUserJwtPayload } from "../utils/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUserJwtPayload;
  }
}

export {};
