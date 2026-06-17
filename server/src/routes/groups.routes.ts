import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import { GroupModel } from "../models/Group";
import { UserModel } from "../models/User";

const router = Router();

const createSchema = z.object({
  name: z.string().min(2),
  isPremium: z.boolean().optional()
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  const ownerId = req.user!.userId;
  const user = await UserModel.findById(ownerId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (user.groupId) {
    res.status(400).json({ message: "User already belongs to a group" });
    return;
  }

  const group = await GroupModel.create({
    name: parsed.data.name,
    ownerId: user._id,
    memberIds: [user._id],
    isPremium: Boolean(parsed.data.isPremium)
  });

  user.groupId = group._id;
  await user.save();

  res.status(201).json(group);
});

router.post("/:groupId/join", requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.user!.userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.groupId) {
    res.status(400).json({ message: "User already belongs to a group" });
    return;
  }

  const group = await GroupModel.findById(req.params.groupId);
  if (!group) {
    res.status(404).json({ message: "Group not found" });
    return;
  }

  group.memberIds.push(user._id);
  await group.save();

  user.groupId = group._id;
  await user.save();

  res.json(group);
});

router.get("/:groupId", requireAuth, async (req, res) => {
  const group = await GroupModel.findById(req.params.groupId).populate("memberIds", "-passwordHash");
  if (!group) {
    res.status(404).json({ message: "Group not found" });
    return;
  }
  res.json(group);
});

export default router;
