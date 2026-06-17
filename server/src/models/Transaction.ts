import { Schema, Types, model } from "mongoose";

export type TransactionType = "escrow_deposit" | "worker_release";
export type TransactionStatus = "pending" | "completed";

export interface ITransaction {
  jobId: Types.ObjectId;
  fromUserId: Types.ObjectId;
  toEntity: "company" | "worker";
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
}

const transactionSchema = new Schema<ITransaction>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toEntity: { type: String, enum: ["company", "worker"], required: true },
    type: { type: String, enum: ["escrow_deposit", "worker_release"], required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "completed"], default: "completed" }
  },
  { timestamps: true }
);

export const TransactionModel = model<ITransaction>("Transaction", transactionSchema);
