import { Schema, Types, model } from "mongoose";

export type BidderType = "user" | "group";

export interface IBid {
  jobId: Types.ObjectId;
  bidderType: BidderType;
  bidderUserId?: Types.ObjectId;
  bidderGroupId?: Types.ObjectId;
  amount: number;
  message?: string;
  selected: boolean;
}

const bidSchema = new Schema<IBid>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    bidderType: { type: String, enum: ["user", "group"], required: true },
    bidderUserId: { type: Schema.Types.ObjectId, ref: "User" },
    bidderGroupId: { type: Schema.Types.ObjectId, ref: "Group" },
    amount: { type: Number, required: true, min: 0 },
    message: { type: String, trim: true },
    selected: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const BidModel = model<IBid>("Bid", bidSchema);
