import Link from "next/link"
import { cn } from "@/lib/utils"

export function LogoSmall({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600">
        <svg viewBox="0 0 80 80" className="h-6 w-6">
          <path d="M20 48 L30 58 L55 28" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">Chayan</div>
        <div className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 -mt-0.5">select right. serve right.</div>
      </div>
    </Link>
  )
}
