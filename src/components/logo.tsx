export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>

      {/* Outer circle */}
      <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" stroke="#ffffff" strokeWidth="2" />

      {/* Bitcoin-like symbol */}
      <path
        d="M35 25 L35 75 M30 30 L65 30 M30 50 L65 50 M30 70 L65 70"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Decorative elements */}
      <circle cx="25" cy="25" r="3" fill="#ffffff" opacity="0.8" />
      <circle cx="75" cy="25" r="3" fill="#ffffff" opacity="0.8" />
      <circle cx="25" cy="75" r="3" fill="#ffffff" opacity="0.8" />
      <circle cx="75" cy="75" r="3" fill="#ffffff" opacity="0.8" />
    </svg>
  )
}
