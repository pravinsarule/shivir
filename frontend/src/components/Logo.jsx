export default function Logo({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#1c3d32" />
      <path
        d="M9.5 34.5 24 14.5 38.5 34.5"
        fill="none"
        stroke="#e8d5a3"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M24 21.5v13" stroke="#e8d5a3" strokeWidth="1.7" />
      <circle cx="24" cy="18" r="2.6" fill="#c45c38" />
    </svg>
  )
}
