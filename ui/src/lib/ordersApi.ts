import { apiJson } from './api'

export type MenuCatalogItem = {
  id: string
  name: string
  description: string
  price: string
  image: string
  imageAlt: string
  badge?: string
}

export type OrderLineResponse = {
  dishId: string
  name: string
  quantity: number
  unitPrice: string
  lineTotal: string
}

export type OrderResponse = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  fulfillment: 'pickup' | 'delivery'
  addressNotes: string
  items: OrderLineResponse[]
  subtotal: string
  subtotalCents: number
  status: string
  source: string
  createdAt?: string
}

export type CreateOrderPayload = {
  customerName: string
  customerEmail: string
  customerPhone: string
  fulfillment: 'pickup' | 'delivery'
  addressNotes?: string
  items: { dishId: string; quantity: number }[]
}

export async function fetchMenuCatalog(): Promise<MenuCatalogItem[]> {
  const res = await apiJson<{ success: true; data: { items: MenuCatalogItem[] } }>('/api/menu/catalog')
  return res.data.items
}

export async function createOrder(
  payload: CreateOrderPayload,
  token: string | null,
): Promise<{ order: OrderResponse }> {
  const headers: HeadersInit = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await apiJson<{ success: true; message?: string; data: { order: OrderResponse } }>('/api/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  return res.data
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type AgentChatResponse = {
  reply: string
  order: OrderResponse | null
  usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number }
}

export async function postAgentChat(
  messages: ChatMessage[],
  token: string | null,
): Promise<AgentChatResponse> {
  const headers: HeadersInit = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await apiJson<{ success: true; data: AgentChatResponse }>('/api/agent/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages }),
  })
  return res.data
}

export async function fetchMyOrders(token: string): Promise<OrderResponse[]> {
  const res = await apiJson<{ success: true; data: { orders: OrderResponse[] } }>('/api/orders/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data.orders
}
