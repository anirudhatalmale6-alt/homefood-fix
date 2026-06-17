import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AuthPageShell } from '../components/auth/AuthPageShell'
import { PASSWORD_HINT, PASSWORD_REGEX } from '../constants/auth'
import { ApiHttpError } from '../lib/api'

const inputClass =
  'mt-1 w-full rounded-xl border border-beige bg-cream px-4 py-3 text-charcoal shadow-sm outline-none transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/25'
const labelClass = 'block text-sm font-semibold text-charcoal'

export default function RegisterPage() {
  const { user, ready, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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
    return <Navigate to="/" replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
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
      await register({ email: email.trim(), name: name.trim(), password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiHttpError ? err.message : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageShell
      title="Create account"
      subtitle={`Password rules: ${PASSWORD_HINT}`}
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Already have an account? Sign in
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className={labelClass} htmlFor="reg-name">
            Name
          </label>
          <input
            id="reg-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
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
          <label className={labelClass} htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
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
          <label className={labelClass} htmlFor="reg-confirm">
            Confirm password
          </label>
          <input
            id="reg-confirm"
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
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>
    </AuthPageShell>
  )
}
