import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { OrderAssistant } from '../components/OrderAssistant'
import { useAuth } from '../auth/AuthContext'
import {
  createOrder,
  fetchMenuCatalog,
  type MenuCatalogItem,
  type OrderResponse,
} from '../lib/ordersApi'

const inputClass =
  'mt-1 w-full rounded-xl border border-beige bg-white px-4 py-3 text-charcoal shadow-sm outline-none transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/25'
const labelClass = 'block text-sm font-semibold text-charcoal'

export default function OrderPage() {
  const { token, user } = useAuth()
  const [items, setItems] = useState<MenuCatalogItem[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [addressNotes, setAddressNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [lastOrder, setLastOrder] = useState<OrderResponse | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await fetchMenuCatalog()
        if (!cancelled) setItems(list)
      } catch {
        if (!cancelled) setLoadError('Could not load menu. Check API URL and that the server is running.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const fillFromAccount = () => {
    if (!user) return
    setCustomerName(user.name)
    setCustomerEmail(user.email)
  }

  const cartLines = useMemo(() => {
    return items
      .map((d) => ({ dish: d, qty: cart[d.id] || 0 }))
      .filter((x) => x.qty > 0)
  }, [items, cart])

  const adjust = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev }
      const q = Math.max(0, (next[id] || 0) + delta)
      if (q === 0) delete next[id]
      else next[id] = q
      return next
    })
  }

  const onManualSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBanner(null)
    if (cartLines.length === 0) {
      setBanner({ type: 'err', text: 'Add at least one dish to your cart.' })
      return
    }
    setSubmitting(true)
    try {
      const data = await createOrder(
        {
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          fulfillment,
          addressNotes: addressNotes.trim(),
          items: cartLines.map(({ dish, qty }) => ({ dishId: dish.id, quantity: qty })),
        },
        token,
      )
      setLastOrder(data.order)
      setBanner({ type: 'ok', text: `Order received! Reference #${data.order.id.slice(-8).toUpperCase()}` })
      setCart({})
      setAddressNotes('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Order failed.'
      setBanner({ type: 'err', text: msg })
    } finally {
      setSubmitting(false)
    }
  }

  const onAgentOrder = useCallback((order: OrderResponse) => {
    setLastOrder(order)
    setBanner({
      type: 'ok',
      text: `Order placed via assistant! Reference #${order.id.slice(-8).toUpperCase()} · ${order.subtotal}`,
    })
  }, [])

  return (
    <section className="border-t border-beige bg-cream px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="order-heading">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-basil/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-basil">
            Order
          </span>
          <h1 id="order-heading" className="mt-4 font-display text-3xl font-semibold text-charcoal sm:text-4xl lg:text-5xl">
            Place an order
          </h1>
          <p className="mt-4 text-lg text-charcoal/75">
            Build a cart from our menu, check out manually, or use the AI assistant to describe what you want in your own words.
          </p>
          <p className="mt-2 text-sm text-charcoal/60">
            Prefer email or phone only?{' '}
            <Link to="/contact" className="font-semibold text-primary hover:underline">
              Contact us
            </Link>
            .
          </p>
        </Reveal>

        {loadError ? (
          <p className="mx-auto mt-8 max-w-xl text-center text-red-700">{loadError}</p>
        ) : null}

        {banner ? (
          <div
            className={`mx-auto mt-8 max-w-2xl rounded-2xl border px-4 py-3 text-center text-sm font-medium ${
              banner.type === 'ok'
                ? 'border-basil/40 bg-basil/10 text-charcoal'
                : 'border-red-200 bg-red-50 text-red-900'
            }`}
            role="status"
          >
            {banner.text}
          </div>
        ) : null}

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal delayMs={40}>
            <OrderAssistant token={token} onOrderCreated={onAgentOrder} />
          </Reveal>

          <Reveal delayMs={80}>
            <div className="rounded-3xl border border-beige bg-white p-5 shadow-xl sm:p-8">
              <h2 className="font-display text-xl font-semibold text-charcoal">Manual checkout</h2>
              <p className="mt-1 text-sm text-charcoal/65">Adjust quantities, then submit. Prices match the menu page.</p>
              {user ? (
                <button
                  type="button"
                  onClick={fillFromAccount}
                  className="mt-3 text-sm font-semibold text-primary hover:underline"
                >
                  Use my account name &amp; email
                </button>
              ) : null}

              <ul className="mt-6 max-h-[min(50vh,28rem)] space-y-3 overflow-y-auto pr-1">
                {items.map((d) => {
                  const q = cart[d.id] || 0
                  return (
                    <li
                      key={d.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-beige bg-cream/40 px-3 py-2 sm:px-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-charcoal">{d.name}</p>
                        <p className="text-sm text-charcoal/65">
                          {d.price}
                          {d.badge ? (
                            <span className="ml-2 rounded-full bg-basil/15 px-2 py-0.5 text-xs font-bold text-basil">
                              {d.badge}
                            </span>
                          ) : null}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Decrease ${d.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-beige bg-white text-lg font-semibold text-charcoal hover:border-primary/40"
                          onClick={() => adjust(d.id, -1)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-charcoal">{q}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${d.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-beige bg-white text-lg font-semibold text-charcoal hover:border-primary/40"
                          onClick={() => adjust(d.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <form className="mt-8 space-y-4 border-t border-beige pt-8" onSubmit={(e) => void onManualSubmit(e)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="ord-name">
                      Name
                    </label>
                    <input
                      id="ord-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className={inputClass}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="ord-email">
                      Email
                    </label>
                    <input
                      id="ord-email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className={inputClass}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="ord-phone">
                    Phone
                  </label>
                  <input
                    id="ord-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className={inputClass}
                    autoComplete="tel"
                  />
                </div>
                <fieldset>
                  <legend className={labelClass}>Fulfillment</legend>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillment === 'pickup'}
                        onChange={() => setFulfillment('pickup')}
                      />
                      Pickup
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillment === 'delivery'}
                        onChange={() => setFulfillment('delivery')}
                      />
                      Delivery
                    </label>
                  </div>
                </fieldset>
                <div>
                  <label className={labelClass} htmlFor="ord-notes">
                    Notes / address
                  </label>
                  <textarea
                    id="ord-notes"
                    value={addressNotes}
                    onChange={(e) => setAddressNotes(e.target.value)}
                    rows={3}
                    className={inputClass}
                    placeholder="Pickup time window, gate code, allergies…"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || cartLines.length === 0}
                  className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-primary-hover disabled:opacity-50"
                >
                  {submitting ? 'Submitting…' : 'Submit order'}
                </button>
              </form>

              {lastOrder ? (
                <p className="mt-4 text-center text-xs text-charcoal/55">
                  Last order id: <span className="font-mono">{lastOrder.id}</span>
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
