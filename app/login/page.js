'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AuthPage() {
  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAuth = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      let response

      if (isLogin) {
        response = await supabase.auth.signInWithPassword({
          email,
          password,
        })
      } else {
        response = await supabase.auth.signUp({
          email,
          password,
        })
      }

      const { data, error } = response

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // LOGIN SUCCESS
      if (isLogin && data.session) {
        router.replace('/dashboard')
        return
      }

      // SIGNUP SUCCESS
      if (!isLogin) {
        setError(
          'Account created! Please check your email to confirm before logging in.'
        )
        setLoading(false)
        return
      }

      setLoading(false)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>WhatsApp CRM</h1>
        <p style={styles.subtitle}>
          {isLogin ? 'Login to manage conversations' : 'Create your account'}
        </p>

        <form onSubmit={handleAuth} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading
              ? 'Please wait...'
              : isLogin
              ? 'Login'
              : 'Create Account'}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.switchText}>
          {isLogin ? 'New here?' : 'Already have an account?'}{' '}
          <span
            style={styles.switchLink}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create Account' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(135deg, #075E54, #128C7E)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
  },
  card: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    width: '360px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '5px',
    color: '#075E54',
  },
  subtitle: {
    marginBottom: '20px',
    color: '#555',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#25D366',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    marginTop: '10px',
    color: 'red',
    fontSize: '13px',
  },
  switchText: {
    marginTop: '20px',
    fontSize: '14px',
  },
  switchLink: {
    color: '#128C7E',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
}
