import { Schema, Types, model } from "mongoose";

export type JobStatus = "open" | "assigned" | "in_progress" | "completed" | "paid_out";

export interface IJob {
  title: string;
  description: string;
  location: string;
  budget: number;
  ownerId: Types.ObjectId;
  status: JobStatus;
  assignedBidId?: Types.ObjectId;
  companyEscrowReceived: boolean;
  workerPaid: boolean;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, min: 0 },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["open", "assigned", "in_progress", "completed", "paid_out"],
      default: "open"
    },
    assignedBidId: { type: Schema.Types.ObjectId, ref: "Bid" },
    companyEscrowReceived: { type: Boolean, default: false },
    workerPaid: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const JobModel = model<IJob>("Job", jobSchema);
