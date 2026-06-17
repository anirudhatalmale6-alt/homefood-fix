import { useCallback, useEffect, useRef, useState } from 'react'
import { postAgentChat, type ChatMessage, type OrderResponse } from '../lib/ordersApi'

type OrderAssistantProps = {
  token: string | null
  onOrderCreated?: (order: OrderResponse) => void
}

const starter: ChatMessage[] = [
  {
    role: 'assistant',
    content:
      'Hi! I can help you browse the menu, build a cart, and place an order. What are you in the mood for today—pickup or delivery?',
  },
]

/** AI ordering assistant — calls `/api/agent/chat` (requires OPENAI_API_KEY on server). */
export function OrderAssistant({ token, onOrderCreated }: OrderAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(starter)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setError(null)
    setInput('')
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)
    try {
      const data = await postAgentChat(next, token)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || '…' }])
      if (data.order) onOrderCreated?.(data.order)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong.'
      setError(msg)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I could not reach the assistant. If you are the site owner, set OPENAI_API_KEY on the server and try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, token, onOrderCreated])

  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-3xl border border-beige bg-white p-4 shadow-lg sm:p-6">
      <h3 className="font-display text-lg font-semibold text-charcoal">AI ordering assistant</h3>
      <p className="mt-1 text-sm text-charcoal/65">
        Chat in plain English. The assistant can look up dishes, quote totals, and submit your order when you confirm.
      </p>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-beige/80 bg-cream/50 p-3 sm:p-4">
        {messages.map((m, i) => (
          <div
            key={`${i}-${m.role}`}
            className={`max-w-[95%] rounded-2xl px-3 py-2 text-sm leading-relaxed sm:text-[0.9375rem] ${
              m.role === 'user'
                ? 'ml-auto bg-primary text-white'
                : 'mr-auto border border-beige bg-white text-charcoal shadow-sm'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading ? (
          <div className="text-sm italic text-charcoal/60" aria-live="polite">
            Assistant is thinking…
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>
      <div className="mt-4 flex gap-2">
        <label htmlFor="order-ai-input" className="sr-only">
          Message to assistant
        </label>
        <input
          id="order-ai-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send()
            }
          }}
          placeholder="e.g. Two pot roasts and a lasagna for pickup…"
          className="min-h-[48px] flex-1 rounded-xl border border-beige bg-white px-4 py-2 text-charcoal outline-none ring-primary/20 focus:border-primary focus:ring-2"
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={loading || !input.trim()}
          className="shrink-0 rounded-xl bg-charcoal px-4 py-2 text-sm font-semibold text-white transition hover:bg-charcoal/90 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
