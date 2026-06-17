import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthPageShell } from '../components/auth/AuthPageShell'
import { apiJson, ApiHttpError } from '../lib/api'

const inputClass =
  'mt-1 w-full rounded-xl border border-beige bg-cream px-4 py-3 text-charcoal shadow-sm outline-none transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/25'
const labelClass = 'block text-sm font-semibold text-charcoal'

type ForgotResponse = {
  success: true
  message?: string
  data?: { resetToken?: string; resetLink?: string }
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [devHint, setDevHint] = useState<{ link?: string; token?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setDevHint(null)
    setLoading(true)
    try {
      const res = await apiJson<ForgotResponse>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      })
      setDone(true)
      if (res.data?.resetLink || res.data?.resetToken) {
        setDevHint({ link: res.data.resetLink, token: res.data.resetToken })
      }
    } catch (err) {
      setError(err instanceof ApiHttpError ? err.message : 'Request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageShell
      title="Forgot password"
      subtitle="We’ll email reset instructions when mail is configured. Until then, use a dev API that exposes reset links."
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      {done ? (
        <div className="space-y-4 text-sm text-charcoal/80">
          <p>If an account exists for that address, you can reset your password using the link we send.</p>
          {devHint?.link ? (
            <p>
              <span className="font-semibold text-charcoal">Dev reset link:</span>{' '}
              <a href={devHint.link} className="break-all text-primary underline">
                {devHint.link}
              </a>
            </p>
          ) : null}
          {devHint?.token && !devHint.link ? (
            <p>
              <span className="font-semibold text-charcoal">Dev token:</span>{' '}
              <code className="break-all text-xs">{devHint.token}</code>
            </p>
          ) : null}
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className={labelClass} htmlFor="forgot-email">
              Email
            </label>
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error ? (
            <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-charcoal" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-white shadow-md transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthPageShell>
  )
}
