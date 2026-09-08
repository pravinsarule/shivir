import Logo from '../components/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const PROGRAMMES = [
  {
    title: 'Shiksha',
    kicker: 'Education',
    copy: 'After-school learning camps, libraries, and scholarships for first-generation learners.',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Arogya',
    kicker: 'Health',
    copy: 'Mobile clinics, nutrition kits, and maternal care camps in villages with no nearby PHC.',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Udyam',
    kicker: 'Livelihood',
    copy: 'Self-help groups, skill training, and micro-enterprise support for rural women.',
    image:
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=900&q=80',
  },
]

const UPDATES = [
  { date: '12 Sep', title: 'Monsoon learning camp, Mulshi', detail: '42 children enrolled this week.' },
  { date: '18 Sep', title: 'Health shibir, Baramati', detail: 'Need 6 extra volunteers for registration.' },
  { date: '24 Sep', title: 'Udyam market day, Pune', detail: 'Women’s collective stall setup at 8am.' },
]

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-svh bg-cream text-ink">
      <header className="border-b border-sand bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9" />
            <div>
              <p className="font-display text-lg leading-none">Shibir Foundation</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-moss">Volunteer desk</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-moss">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-sand px-4 py-2 text-sm font-medium hover:bg-sand/40"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1800&q=80"
          alt="Community gathering at a village programme"
          className="h-[52vh] min-h-[340px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/70 to-forest/20" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-5 pb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Namaste, {user.name.split(' ')[0]}</p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl leading-tight font-semibold text-cream sm:text-5xl">
            The camp is open. Today we reach a little further.
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <section>
            <p className="text-xs uppercase tracking-[0.28em] text-clay">Our work</p>
            <h2 className="font-display mt-2 text-3xl">Programmes across the field</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {PROGRAMMES.map((programme) => (
                <article
                  key={programme.title}
                  className="overflow-hidden rounded-2xl border border-sand bg-paper"
                >
                  <img
                    src={programme.image}
                    alt=""
                    className="h-36 w-full object-cover"
                  />
                  <div className="p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-moss">
                      {programme.kicker}
                    </p>
                    <h3 className="font-display mt-1 text-2xl">{programme.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">{programme.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-sand bg-paper p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-clay">Upcoming shibirs</p>
            <h2 className="font-display mt-2 text-2xl">This month</h2>
            <ul className="mt-6 space-y-5">
              {UPDATES.map((item) => (
                <li key={item.title} className="border-t border-sand pt-4 first:border-t-0 first:pt-0">
                  <p className="text-xs font-medium tracking-wide text-moss">{item.date}</p>
                  <p className="mt-1 font-medium">{item.title}</p>
                  <p className="text-sm text-ink/65">{item.detail}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>

      <footer className="border-t border-sand bg-forest px-5 py-8 text-sand">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg text-cream">Shibir Foundation</p>
          <p className="text-sm">Education · Health · Livelihood · Pune, India</p>
        </div>
      </footer>
    </div>
  )
}
