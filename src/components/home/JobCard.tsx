"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  IndianRupee,
  Users,
  Share2,
} from "lucide-react"
import { BookmarkButton } from "@/components/layout/BookmarkButton"
import { cn, formatDate, formatSalary, getStatusColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface JobCardProps {
  id: string
  title: string
  department: string
  departmentSlug?: string
  location?: string | null
  totalVacancies?: number | null
  lastDateToApply?: Date | string | null
  salary?: string | null
  status: "ACTIVE" | "EXPIRED" | "UPCOMING"
  slug: string
  className?: string
}

const statusLabel: Record<string, string> = {
  ACTIVE: "Active",
  EXPIRED: "Expired",
  UPCOMING: "Upcoming",
}

export function JobCard({
  id,
  title,
  department,
  location,
  totalVacancies,
  lastDateToApply,
  salary,
  status,
  slug,
  className,
}: JobCardProps) {
  const [isSharing, setIsSharing] = useState(false)
  const isLastDateUrgent = lastDateToApply
    ? new Date(lastDateToApply).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 &&
      new Date(lastDateToApply) > new Date()
    : false

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      try {
        setIsSharing(true)
        await navigator.share({
          title,
          text: `Apply for ${title} - ${department}`,
          url: `/jobs/${slug}`,
        })
      } catch {
      } finally {
        setIsSharing(false)
      }
    } else {
      await navigator.clipboard.writeText(`${window.location.origin}/apply/${slug}`)
    }
  }

  return (
    <div>
      <Link href={`/apply/${slug}`} className="block">
        <Card
          className={cn(
            "group border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
            className
          )}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0.5">
                    {department}
                  </Badge>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      getStatusColor(status)
                    )}
                  >
                    {statusLabel[status]}
                  </span>
                </div>
                <h3 className="mb-3 text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                  {location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {location}
                    </span>
                  )}
                  {totalVacancies != null && (
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      {totalVacancies} Vacanc{totalVacancies === 1 ? "y" : "ies"}
                    </span>
                  )}
                  {lastDateToApply && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span
                        className={cn(isLastDateUrgent && "font-medium text-red-600")}
                      >
                        {formatDate(lastDateToApply)}
                      </span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <IndianRupee className="h-3 w-3 text-gray-400" />
                    {formatSalary(salary)}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <BookmarkButton jobId={id} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-300 hover:text-blue-500"
                  onClick={handleShare}
                  disabled={isSharing}
                  aria-label="Share"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export function JobCardSkeleton() {
  return (
    <Card className="overflow-hidden border-gray-200 bg-white">
      <CardContent className="p-5">
        <div className="mb-3 flex gap-2">
          <div className="h-4 w-20 animate-pulse rounded-full bg-gray-100" />
          <div className="h-4 w-14 animate-pulse rounded-full bg-gray-100" />
        </div>
        <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="flex flex-wrap gap-4">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
        </div>
      </CardContent>
    </Card>
  )
}
