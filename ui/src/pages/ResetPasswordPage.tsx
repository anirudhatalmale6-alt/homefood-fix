import { type FormEvent, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthPageShell } from '../components/auth/AuthPageShell'
import { PASSWORD_HINT, PASSWORD_REGEX } from '../constants/auth'
import { apiJson, ApiHttpError } from '../lib/api'

const inputClass =
  'mt-1 w-full rounded-xl border border-beige bg-cream px-4 py-3 text-charcoal shadow-sm outline-none transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/25'
const labelClass = 'block text-sm font-semibold text-charcoal'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const tokenFromUrl = params.get('token') || ''

  const [token, setToken] = useState(tokenFromUrl)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!token.trim()) {
      setError('Reset token is missing. Open the link from your email or paste the token in the URL (?token=…).')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!PASSWORD_REGEX.test(password)) {
      setError(PASSWORD_HINT)
      return
    }
    setLoading(true)
    try {
      await apiJson('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: token.trim(), password }),
      })
      setDone(true)
    } catch (err) {
      setError(err instanceof ApiHttpError ? err.message : 'Reset failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageShell
      title="Set new password"
      subtitle={PASSWORD_HINT}
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in with your new password
        </Link>
      }
    >
      {done ? (
        <p className="text-sm text-charcoal/80">Your password was updated. You can sign in now.</p>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className={labelClass} htmlFor="reset-token">
              Reset token
            </label>
            <input
              id="reset-token"
              name="token"
              type="text"
              className={inputClass}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="From email link"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="reset-password">
              New password
            </label>
            <input
              id="reset-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="reset-confirm">
              Confirm password
            </label>
            <input
              id="reset-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              className={inputClass}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? 'Saving…' : 'Update password'}
          </button>
        </form>
      )}
    </AuthPageShell>
  )
}
