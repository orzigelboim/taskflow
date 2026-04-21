import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError('Invalid email or password')
  }

  return (
    <div className="h-full flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-tx-primary mb-1">TaskFlow</h1>
        <p className="text-tx-muted text-sm mb-8">Sign in to access your tasks</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-bg-card border border-border rounded-xl px-4 py-3 text-tx-primary placeholder-tx-muted outline-none focus:border-logo-gold transition-colors text-sm"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-bg-card border border-border rounded-xl px-4 py-3 text-tx-primary placeholder-tx-muted outline-none focus:border-logo-gold transition-colors text-sm"
          />
          {error && <p className="text-logo-red text-xs px-1">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="text-white font-medium py-3 rounded-xl transition-opacity disabled:opacity-50 text-sm"
            style={{ background: 'linear-gradient(90deg, #D8131D, #EBAF20)' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
