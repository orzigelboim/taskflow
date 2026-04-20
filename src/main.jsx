import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './contexts/AppContext'
import Login from './components/Login'
import { supabase } from './lib/supabase'
import './index.css'

function AuthGate() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-base">
        <div className="w-6 h-6 border-2 border-tx-muted border-t-logo-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <Login />

  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/taskflow">
      <AuthGate />
    </BrowserRouter>
  </React.StrictMode>
)
