"use client"

import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface BreadcrumbSegment {
  label: string
  href: string
}

interface BreadcrumbNavProps {
  segments?: BreadcrumbSegment[]
  className?: string
  homeLabel?: string
}

function generateSegmentsFromPath(pathname: string): BreadcrumbSegment[] {
  const parts = pathname.split("/").filter(Boolean)

  const excludeSegments = new Set(["public", "category"])

  return parts
    .filter((part) => !excludeSegments.has(part))
    .map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/")
      const label = part
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      return { label, href }
    })
}

export function BreadcrumbNav({ segments, className, homeLabel = "Home" }: BreadcrumbNavProps) {
  const pathname = usePathname()
  const breadcrumbs = segments ?? generateSegmentsFromPath(pathname)

  if (breadcrumbs.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn("", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">{homeLabel}</span>
          </Link>
        </li>
        {breadcrumbs.map((segment, index) => {
          const isLast = index === breadcrumbs.length - 1
          return (
            <li key={segment.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-4 w-4" />
              {isLast ? (
                <span className="font-medium text-gray-900 dark:text-gray-100" aria-current="page">
                  {segment.label}
                </span>
              ) : (
                <Link
                  href={segment.href}
                  className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
                >
                  {segment.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
