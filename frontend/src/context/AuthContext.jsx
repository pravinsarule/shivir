import { createContext, useContext, useMemo, useState } from 'react'

const API_BASE_URL = 'https://backend-729310986605.asia-south1.run.app/api'

const AuthContext = createContext(null)

function readStoredSession() {
  try {
    const rawUser = localStorage.getItem('shibir-user')
    const token = localStorage.getItem('shibir-token')
    if (rawUser && token) {
      return { user: JSON.parse(rawUser), token }
    }
  } catch {}
  return { user: null, token: null }
}

export function AuthProvider({ children }) {
  const initialSession = readStoredSession()
  const [user, setUser] = useState(initialSession.user)
  const [token, setToken] = useState(initialSession.token)

  const value = useMemo(
    () => ({
      user,
      token,
      async login(email, password) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await res.json()

          if (!res.ok || !data.success) {
            return {
              ok: false,
              message: data.message || 'Login failed. Please check your credentials.',
            }
          }

          localStorage.setItem('shibir-user', JSON.stringify(data.user))
          localStorage.setItem('shibir-token', data.token)
          setUser(data.user)
          setToken(data.token)

          return { ok: true, user: data.user }
        } catch (err) {
          console.error('Login error:', err)
          return {
            ok: false,
            message: 'Unable to connect to backend server. Make sure Node backend is running.',
          }
        }
      },
      setUserAndToken(newUser, newToken) {
        localStorage.setItem('shibir-user', JSON.stringify(newUser))
        localStorage.setItem('shibir-token', newToken)
        setUser(newUser)
        setToken(newToken)
      },
      logout() {
        localStorage.removeItem('shibir-user')
        localStorage.removeItem('shibir-token')
        setUser(null)
        setToken(null)
      },
    }),
    [user, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
