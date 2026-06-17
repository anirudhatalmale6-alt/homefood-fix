import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { JobModel } from "../models/Job";
import { TransactionModel } from "../models/Transaction";

const router = Router();

router.post("/jobs/:jobId/escrow-deposit", requireAuth, async (req, res) => {
  const job = await JobModel.findById(req.params.jobId);
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  if (job.ownerId.toString() !== req.user!.userId) {
    res.status(403).json({ message: "Only job owner can deposit escrow" });
    return;
  }
  if (job.status !== "assigned") {
    res.status(400).json({ message: "Escrow can only be paid after selecting a bid" });
    return;
  }
  if (job.companyEscrowReceived) {
    res.status(400).json({ message: "Escrow already paid" });
    return;
  }

  const amount = req.body.amount ?? job.budget;

  const tx = await TransactionModel.create({
    jobId: job._id,
    fromUserId: job.ownerId,
    toEntity: "company",
    type: "escrow_deposit",
    amount,
    status: "completed"
  });

  job.companyEscrowReceived = true;
  job.status = "in_progress";
  await job.save();

  res.json({ message: "Escrow received by company account", transaction: tx, job });
});

router.post("/jobs/:jobId/mark-complete", requireAuth, async (req, res) => {
  const job = await JobModel.findById(req.params.jobId);
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  if (job.ownerId.toString() !== req.user!.userId) {
    res.status(403).json({ message: "Only job owner can mark completion" });
    return;
  }
  if (!job.companyEscrowReceived) {
    res.status(400).json({ message: "Escrow must be deposited first" });
    return;
  }

  job.status = "completed";
  await job.save();
  res.json({ message: "Job marked completed. Release payment when ready.", job });
});

router.post("/jobs/:jobId/release-payment", requireAuth, async (req, res) => {
  const job = await JobModel.findById(req.params.jobId);
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
  if (job.ownerId.toString() !== req.user!.userId) {
    res.status(403).json({ message: "Only job owner can release payment" });
    return;
  }
  if (!job.companyEscrowReceived) {
    res.status(400).json({ message: "No escrow deposit found" });
    return;
  }
  if (job.workerPaid) {
    res.status(400).json({ message: "Payment already released" });
    return;
  }

  const amount = req.body.amount ?? job.budget;
  const tx = await TransactionModel.create({
    jobId: job._id,
    fromUserId: job.ownerId,
    toEntity: "worker",
    type: "worker_release",
    amount,
    status: "completed"
  });

  job.workerPaid = true;
  job.status = "paid_out";
  await job.save();

  res.json({ message: "Payment released to worker", transaction: tx, job });
});

export default router;
