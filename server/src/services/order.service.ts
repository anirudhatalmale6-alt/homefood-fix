import sanitizeHtml from "sanitize-html"
import validator from "validator"
import type { HydratedDocument } from "mongoose"
import { Types } from "mongoose"
import { OrderModel, type IOrder, type IOrderLine, type OrderSource } from "../models/Order"
import { formatCentsUsd, getMenuItemById, parseUsdToCents } from "../data/menu-catalog"
import type { CreateOrderInput } from "../validation/order.schemas"
import { ApiError } from "../middlewares/error"

const stripNotes = (raw: string): string =>
  sanitizeHtml(raw, {
    allowedTags: [],
    allowedAttributes: {}
  })
    .trim()
    .slice(0, 2000)

export const buildOrderLines = (
  items: CreateOrderInput["items"]
): { lines: IOrderLine[]; subtotalCents: number } => {
  const lines: IOrderLine[] = []
  let subtotal = 0

  for (const row of items) {
    const dish = getMenuItemById(row.dishId)
    if (!dish) {
      throw new ApiError(400, `Unknown dish: ${row.dishId}`, "ORDER_UNKNOWN_DISH")
    }
    const unit = parseUsdToCents(dish.price)
    if (unit <= 0) {
      throw new ApiError(500, "Invalid menu price", "ORDER_PRICE_ERROR")
    }
    const lineTotal = unit * row.quantity
    lines.push({
      dishId: dish.id,
      name: dish.name,
      quantity: row.quantity,
      unitPriceCents: unit,
      lineTotalCents: lineTotal
    })
    subtotal += lineTotal
  }

  return { lines, subtotalCents: subtotal }
}

export const createOrderRecord = async (
  input: CreateOrderInput,
  opts: { userId?: string; source?: OrderSource }
): Promise<HydratedDocument<IOrder>> => {
  const email = validator.normalizeEmail(input.customerEmail, { gmail_remove_dots: false }) || input.customerEmail
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email", "ORDER_INVALID_EMAIL")
  }

  const { lines, subtotalCents } = buildOrderLines(input.items)
  const source = opts.source ?? "web"
  const addressNotes = stripNotes(input.addressNotes ?? "")

  const doc = await OrderModel.create({
    userId: opts.userId ? new Types.ObjectId(opts.userId) : undefined,
    customerName: input.customerName.trim(),
    customerEmail: email,
    customerPhone: input.customerPhone.trim(),
    fulfillment: input.fulfillment,
    addressNotes,
    items: lines,
    subtotalCents,
    status: "pending",
    source
  })

  return doc
}

export const toOrderResponse = (order: IOrder & { _id: Types.ObjectId }) => ({
  id: order._id.toString(),
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone,
  fulfillment: order.fulfillment,
  addressNotes: order.addressNotes,
  items: order.items.map((l) => ({
    dishId: l.dishId,
    name: l.name,
    quantity: l.quantity,
    unitPrice: formatCentsUsd(l.unitPriceCents),
    lineTotal: formatCentsUsd(l.lineTotalCents)
  })),
  subtotal: formatCentsUsd(order.subtotalCents),
  subtotalCents: order.subtotalCents,
  status: order.status,
  source: order.source,
  createdAt: order.createdAt?.toISOString() ?? undefined
})

export const listOrdersForUser = async (userId: string) => {
  const rows = await OrderModel.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()
  return rows.map((o) => toOrderResponse(o as IOrder & { _id: Types.ObjectId }))
}

export const getOrderForUser = async (orderId: string, userId: string) => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order id", "ORDER_INVALID_ID")
  }
  const order = await OrderModel.findOne({
    _id: new Types.ObjectId(orderId),
    userId: new Types.ObjectId(userId)
  }).lean()
  if (!order) {
    throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND")
  }
  return toOrderResponse(order as IOrder & { _id: Types.ObjectId })
}
