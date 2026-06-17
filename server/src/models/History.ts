import { Schema, model } from "mongoose";

export interface IHistory {
  eventType: "server_start";
  hostname: string;
  port: number;
  localIps: string[];
  publicIp?: string;
  city?: string;
  region?: string;
  country?: string;
  provider?: string;
  source: string;
  startedAt: Date;
  isVirtualMachine?: boolean;
  vmVendor?: "vmware" | "virtualbox";
}

const historySchema = new Schema<IHistory>(
  {
    eventType: { type: String, required: true, enum: ["server_start"] },
    hostname: { type: String, required: true },
    port: { type: Number, required: true },
    localIps: { type: [String], default: [] },
    publicIp: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    provider: { type: String },
    isVirtualMachine: { type: Boolean },
    vmVendor: { type: String, enum: ["vmware", "virtualbox"] },
    source: { type: String, required: true },
    startedAt: { type: Date, required: true }
  },
  { timestamps: true, collection: "history" }
);

export const HistoryModel = model<IHistory>("History", historySchema);
