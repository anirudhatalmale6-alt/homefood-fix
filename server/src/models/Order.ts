import { Schema, model, Types } from "mongoose"

export type OrderFulfillment = "pickup" | "delivery"
export type OrderStatus = "pending" | "confirmed" | "cancelled"
export type OrderSource = "web" | "agent"

export interface IOrderLine {
  dishId: string
  name: string
  quantity: number
  unitPriceCents: number
  lineTotalCents: number
}

export interface IOrder {
  userId?: Types.ObjectId
  customerName: string
  customerEmail: string
  customerPhone: string
  fulfillment: OrderFulfillment
  addressNotes: string
  items: IOrderLine[]
  subtotalCents: number
  status: OrderStatus
  source: OrderSource
  createdAt?: Date
  updatedAt?: Date
}

const orderLineSchema = new Schema<IOrderLine>(
  {
    dishId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPriceCents: { type: Number, required: true, min: 0 },
    lineTotalCents: { type: Number, required: true, min: 0 }
  },
  { _id: false }
)

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: undefined },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    fulfillment: { type: String, enum: ["pickup", "delivery"], required: true },
    addressNotes: { type: String, default: "", maxlength: 2000 },
    items: { type: [orderLineSchema], required: true },
    subtotalCents: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    source: { type: String, enum: ["web", "agent"], default: "web" }
  },
  { timestamps: true }
)

orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ customerEmail: 1, createdAt: -1 })

export const OrderModel = model<IOrder>("Order", orderSchema)
