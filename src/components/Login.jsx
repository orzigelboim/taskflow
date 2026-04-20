import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://orzigelboim.github.io/taskflow/' }
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="h-full flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-tx-primary mb-1">TaskFlow</h1>
        <p className="text-tx-muted text-sm mb-8">Sign in to access your tasks</p>

        {sent ? (
          <div className="bg-bg-card border border-border rounded-2xl p-6 text-center">
            <p className="text-tx-primary font-medium">Check your email</p>
            <p className="text-tx-muted text-sm mt-2">
              We sent a login link to <span className="text-tx-primary">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-bg-card border border-border rounded-xl px-4 py-3 text-tx-primary placeholder-tx-muted outline-none focus:border-indigo-500 transition-colors text-sm"
            />
            {error && <p className="text-red-400 text-xs px-1">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? 'Sending…' : 'Send login link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
