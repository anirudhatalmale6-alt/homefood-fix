import { z } from "zod"

const orderItemInput = z.object({
  dishId: z.string().min(1).max(32),
  quantity: z.number().int().min(1).max(99)
})

export const createOrderSchema = z.object({
  customerName: z.string().min(1).max(120).trim(),
  customerEmail: z.string().email().max(254).trim(),
  customerPhone: z.string().min(7).max(32).trim(),
  fulfillment: z.enum(["pickup", "delivery"]),
  addressNotes: z.string().max(2000).optional().default(""),
  items: z.array(orderItemInput).min(1).max(30)
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

const agentMessage = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(12000)
})

export const agentChatSchema = z.object({
  messages: z.array(agentMessage).min(1).max(40)
})

export type AgentChatInput = z.infer<typeof agentChatSchema>
