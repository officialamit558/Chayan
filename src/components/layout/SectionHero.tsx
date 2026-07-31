"use client"

import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SectionHeroProps {
  icon: LucideIcon
  badge: string
  title: string
  subtitle: string
  count?: number
}

export function SectionHero({ icon: Icon, badge, title, subtitle, count }: SectionHeroProps) {
  return (
    <header className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] via-blue-800 to-blue-700 p-6 text-white shadow-lg sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-amber-400/10 blur-2xl" />

      <div className="relative flex flex-wrap items-center gap-5">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <Icon className="h-8 w-8" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-400 font-semibold text-amber-950">{badge}</Badge>
            {count !== undefined && count > 0 && (
              <Badge className="bg-white/15 text-white backdrop-blur">{count} listings</Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-blue-100 sm:text-base">{subtitle}</p>
        </div>
      </div>
    </header>
  )
}
