import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AuthPageShell } from '../components/auth/AuthPageShell'
import { ApiHttpError } from '../lib/api'

const inputClass =
  'mt-1 w-full rounded-xl border border-beige bg-cream px-4 py-3 text-charcoal shadow-sm outline-none transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/25'
const labelClass = 'block text-sm font-semibold text-charcoal'

export default function LoginPage() {
  const { user, ready, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-cream text-sm text-charcoal/60">
        Loading…
      </div>
    )
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiHttpError ? err.message : 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageShell
      title="Sign in"
      subtitle="Welcome back — use the email and password for your homefood account."
      footer={
        <>
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
          {' · '}
          <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className={labelClass} htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthPageShell>
  )
}
