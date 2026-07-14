"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BreadcrumbProps {
  className?: string
  homeLabel?: string
  segments?: { label: string; href: string }[]
}

function Breadcrumb({ className, homeLabel = "Home", segments: customSegments }: BreadcrumbProps) {
  const pathname = usePathname()

  const generateSegments = (): { label: string; href: string }[] => {
    if (customSegments) return customSegments

    const parts = pathname.split("/").filter(Boolean)
    return parts.map((part, index) => ({
      label: part.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
      href: "/" + parts.slice(0, index + 1).join("/"),
    }))
  }

  const segments = generateSegments()

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1.5 text-sm text-gray-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">{homeLabel}</span>
          </Link>
        </li>
        {segments.map((segment, index) => (
          <li key={segment.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4" />
            {index === segments.length - 1 ? (
              <span className="font-medium text-gray-900" aria-current="page">
                {segment.label}
              </span>
            ) : (
              <Link
                href={segment.href}
                className="hover:text-gray-900 transition-colors"
              >
                {segment.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export { Breadcrumb }
