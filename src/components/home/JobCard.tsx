"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  IndianRupee,
  Users,
  Bookmark,
  Share2,
  BookmarkCheck,
} from "lucide-react"
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
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const isLastDateUrgent = lastDateToApply
    ? new Date(lastDateToApply).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 &&
      new Date(lastDateToApply) > new Date()
    : false

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked((prev) => !prev)
  }

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
            "group relative overflow-hidden border-gray-200 transition-colors hover:border-blue-300 hover:shadow-md",
            className
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardContent className="relative p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {department}
                  </Badge>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      getStatusColor(status)
                    )}
                  >
                    {statusLabel[status]}
                  </span>

                </div>
                <h3 className="mb-3 text-base font-semibold leading-snug text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                  {location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {location}
                    </span>
                  )}
                  {totalVacancies != null && (
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      {totalVacancies} Vacanc{totalVacancies === 1 ? "y" : "ies"}
                    </span>
                  )}
                  {lastDateToApply && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span
                        className={cn(isLastDateUrgent && "font-medium text-red-600")}
                      >
                        {formatDate(lastDateToApply)}
                      </span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                    {formatSalary(salary)}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-yellow-500"
                  onClick={handleBookmark}
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-blue-500"
                  onClick={handleShare}
                  disabled={isSharing}
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4" />
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
    <Card className="overflow-hidden border-gray-200">
      <CardContent className="p-5">
        <div className="mb-3 flex gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="mb-3 h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="flex flex-wrap gap-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  )
}
