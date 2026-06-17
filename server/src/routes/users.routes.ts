import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { UserModel } from "../models/User";
import { ApiError } from "../middlewares/error";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.user!.userId).select("-passwordHash");
  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }
  res.json({
    success: true,
    data: user
  });
});

export default router;
