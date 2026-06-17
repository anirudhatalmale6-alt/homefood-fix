import { Schema, Types, model } from "mongoose";

export interface IGroup {
  name: string;
  ownerId: Types.ObjectId;
  memberIds: Types.ObjectId[];
  isPremium: boolean;
}

const groupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    isPremium: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const GroupModel = model<IGroup>("Group", groupSchema);
