import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import * as auth from "../controllers/auth.controller";

const router = Router();

router.post("/register", auth.register);
router.post("/signup", (_req, res) => res.redirect(308, "/api/auth/register"));
router.post("/create-account", (_req, res) => res.redirect(308, "/api/auth/register"));

router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);
router.post("/verify-email", auth.verifyEmail);

router.get("/me", requireAuth, auth.me);
router.post("/logout", auth.logout);

export default router;
