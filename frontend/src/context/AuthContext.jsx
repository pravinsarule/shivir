import { createContext, useContext, useMemo, useState } from 'react'

const USERS = [
  {
    email: 'volunteer@shibir.org',
    password: 'shibir123',
    name: 'Meera Joshi',
    role: 'Field Volunteer',
  },
  {
    email: 'admin@shibir.org',
    password: 'admin123',
    name: 'Arjun Deshmukh',
    role: 'Programme Lead',
  },
]

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem('shibir-user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const value = useMemo(
    () => ({
      user,
      login(email, password) {
        const found = USERS.find(
          (entry) =>
            entry.email.toLowerCase() === email.trim().toLowerCase() &&
            entry.password === password
        )

        if (!found) {
          return { ok: false, message: 'These details do not match our volunteer records.' }
        }

        const session = {
          email: found.email,
          name: found.name,
          role: found.role,
        }
        localStorage.setItem('shibir-user', JSON.stringify(session))
        setUser(session)
        return { ok: true }
      },
      logout() {
        localStorage.removeItem('shibir-user')
        setUser(null)
      },
    }),
    [user]
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
