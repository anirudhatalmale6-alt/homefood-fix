import { Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import { BidModel } from "../models/Bid";
import { JobModel } from "../models/Job";
import { UserModel } from "../models/User";

const router = Router();

const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(8),
  location: z.string().min(2),
  budget: z.number().positive()
});

const createBidSchema = z.object({
  bidderType: z.enum(["user", "group"]),
  amount: z.number().positive(),
  message: z.string().optional()
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = createJobSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }
  const job = await JobModel.create({ ...parsed.data, ownerId: req.user!.userId });
  res.status(201).json(job);
});

router.get("/", async (_req, res) => {
  const jobs = await JobModel.find().sort({ createdAt: -1 });
  res.json(jobs);
});

router.get("/:jobId", async (req, res) => {
  const job = await JobModel.findById(req.params.jobId);
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  const bids = await BidModel.find({ jobId: job._id });
  res.json({ job, bids });
});

router.post("/:jobId/bids", requireAuth, async (req, res) => {
  const parsed = createBidSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
    return;
  }

  const job = await JobModel.findById(req.params.jobId);
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  if (job.status !== "open") {
    res.status(400).json({ message: "Bidding closed for this job" });
    return;
  }

  const user = await UserModel.findById(req.user!.userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const bidPayload: {
    jobId: Types.ObjectId;
    bidderType: "user" | "group";
    bidderUserId?: Types.ObjectId;
    bidderGroupId?: Types.ObjectId;
    amount: number;
    message?: string;
  } = {
    jobId: job._id,
    bidderType: parsed.data.bidderType,
    amount: parsed.data.amount,
    message: parsed.data.message
  };

  if (parsed.data.bidderType === "group") {
    if (!user.groupId) {
      res.status(400).json({ message: "User must join a group first" });
      return;
    }
    bidPayload.bidderGroupId = user.groupId;
  } else {
    bidPayload.bidderUserId = user._id;
  }

  const bid = await BidModel.create(bidPayload);
  res.status(201).json(bid);
});

router.post("/:jobId/select-bid/:bidId", requireAuth, async (req, res) => {
  const job = await JobModel.findById(req.params.jobId);
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  if (job.ownerId.toString() !== req.user!.userId) {
    res.status(403).json({ message: "Only job owner can select bid" });
    return;
  }
  if (job.status !== "open") {
    res.status(400).json({ message: "Bid already selected" });
    return;
  }

  const bid = await BidModel.findById(req.params.bidId);
  if (!bid || bid.jobId.toString() !== job._id.toString()) {
    res.status(404).json({ message: "Bid not found for this job" });
    return;
  }

  bid.selected = true;
  await bid.save();

  job.assignedBidId = bid._id;
  job.status = "assigned";
  await job.save();

  res.json({ message: "Bid selected. Next step: escrow payment to company account.", job, bid });
});

export default router;
