import { Schema, model, Types } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  passwordHash: string;
  homeLocation?: string;
  isVip: boolean;
  emailVerified: boolean;
  emailVerificationTokenHash?: string;
  emailVerificationExpiresAt?: Date;
  passwordResetTokenHash?: string;
  passwordResetExpiresAt?: Date;
  groupId?: Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    homeLocation: { type: String, default: "" },
    isVip: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String },
    emailVerificationExpiresAt: { type: Date },
    passwordResetTokenHash: { type: String },
    passwordResetExpiresAt: { type: Date },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" }
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
