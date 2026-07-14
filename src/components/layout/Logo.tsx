export function Logo({ className }: { className?: string }) {
  return (
    <svg width="100%" viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg" role="img" className={className}>
      <title>Chayan logo</title>
      <desc>A logo mark for Chayan featuring a teal rounded square containing a checkmark that transitions into an upward arrow, next to the wordmark Chayan in navy.</desc>
      <defs>
        <clipPath id="badgeClip"><rect x="60" y="80" width="120" height="120" rx="26"/></clipPath>
      </defs>
      <rect x="60" y="80" width="120" height="120" rx="26" fill="#0f766e" />
      <g clipPath="url(#badgeClip)">
        <path d="M92 148 L118 174 L172 108" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="212" y="163" fontFamily="var(--font-sans)" fontSize="72" fontWeight="500" fill="currentColor">Chayan</text>
      <text x="214" y="196" fontFamily="var(--font-sans)" fontSize="20" fontWeight="400" fill="currentColor" opacity="0.7">select right. serve right.</text>
    </svg>
  )
}
