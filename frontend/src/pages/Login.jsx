import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const DEMO_ACCOUNTS = [
  { email: 'volunteer@shibir.org', password: 'shibir123', label: 'Volunteer' },
  { email: 'admin@shibir.org', password: 'admin123', label: 'Programme Lead' },
]

const STATS = [
  { value: '48,000+', label: 'Children in school' },
  { value: '120', label: 'Villages reached' },
  { value: '2,400', label: 'Women in livelihood groups' },
]

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }

    setSubmitting(true)
    const result = login(email, password)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.message)
    }
  }

  function fillDemo(account) {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
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
                A camp of hope for every child.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-sand">
                Shibir runs education, health, and livelihood programmes across rural Maharashtra —
                so no family is left without a place to begin again.
              </p>
            </div>

            <ul className="grid grid-cols-3 gap-6 border-t border-cream/15 pt-8">
              {STATS.map((stat) => (
                <li key={stat.label}>
                  <p className="font-display text-3xl text-cream">{stat.value}</p>
                  <p className="mt-1 text-sm text-sand/80">{stat.label}</p>
                </li>
              ))}
            </ul>
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
              Registered NGO · 12A / 80G
            </p>
          </header>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.28em] text-clay">Volunteer portal</p>
            <h2 className="font-display mt-3 text-4xl leading-tight font-semibold tracking-tight">
              Welcome back to camp.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
              Sign in to view field updates, upcoming shibirs, and your assigned programmes.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Email</span>
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@shibir.org"
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
                    placeholder="Enter your password"
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
                {submitting ? 'Signing in…' : 'Enter the camp'}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-sand bg-cream/80 p-4">
              <p className="text-xs font-medium tracking-wide text-moss uppercase">
                Dummy login for demo
              </p>
              <div className="mt-3 grid gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => fillDemo(account)}
                    className="flex items-center justify-between rounded-xl bg-paper px-3 py-2.5 text-left text-sm transition hover:bg-sand/50"
                  >
                    <span>
                      <span className="block font-medium">{account.label}</span>
                      <span className="text-ink/60">{account.email}</span>
                    </span>
                    <span className="font-mono text-xs text-moss">{account.password}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-ink/45">
            80G donations eligible · CIN-free charitable trust · shibir.org
          </p>
        </section>
      </div>
    </div>
  )
}
