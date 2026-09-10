import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter email, password, and select your role.')
      return
    }

    setSubmitting(true)
    const result = await login(email, password)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-svh bg-cream text-ink">
      <div className="grid min-h-svh lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80"
            alt="Children and volunteers at a community learning camp"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/75 to-forest/35" />

          <div className="relative flex h-full flex-col justify-between p-10 text-cream xl:p-14">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <p className="font-display text-xl tracking-tight text-cream">Shibir</p>
                <p className="text-[11px] uppercase tracking-[0.28em] text-sand/80">Foundation</p>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="mb-4 text-xs uppercase tracking-[0.32em] text-gold">Est. 2014 · Pune</p>
              <h1 className="font-display text-5xl leading-[1.08] font-semibold tracking-tight text-cream xl:text-6xl">
                Role-based Secure Access Portal
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-sand">
                Enter your registered credentials and role to unlock your role-specific dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col bg-paper px-6 py-8 sm:px-10 lg:px-12 xl:px-16">
          <header className="mb-10 flex items-center justify-between lg:mb-0">
            <div className="flex items-center gap-3 lg:hidden">
              <Logo className="h-9 w-9" />
              <div>
                <p className="font-display text-lg leading-none">Shibir</p>
                <p className="text-[10px] uppercase tracking-[0.26em] text-moss">Foundation</p>
              </div>
            </div>
            <p className="ml-auto text-[11px] uppercase tracking-[0.2em] text-moss/70">
              PostgreSQL & Node.js Backend Active
            </p>
          </header>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.28em] text-clay">Role-Based Auth</p>
            <h2 className="font-display mt-3 text-4xl leading-tight font-semibold tracking-tight">
              Sign in to Dashboard
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
              Verify your Email, Password and Role to proceed.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Email</span>
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="volunteer@shibir.org or admin@shibir.org"
                  className="w-full rounded-xl border border-sand bg-cream px-4 py-3 text-[15px] outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-sand bg-cream px-4 py-3 pr-16 text-[15px] outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((open) => !open)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium tracking-wide text-moss"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              {error ? (
                <p className="rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-forest py-3.5 text-sm font-semibold tracking-wide text-cream transition hover:bg-moss disabled:opacity-60"
              >
                {submitting ? 'Authenticating with Backend…' : 'Login to Dashboard'}
              </button>
            </form>
          </div>

          <p className="mt-10 text-center text-xs text-ink/45">
            Node.js + Express + PostgreSQL + JWT Authentication
          </p>
        </section>
      </div>
    </div>
  )
}
