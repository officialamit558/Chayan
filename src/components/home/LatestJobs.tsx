"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { JobCard, JobCardSkeleton } from "@/components/home/JobCard"

interface Job {
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
}

interface LatestJobsProps {
  className?: string
}

export function LatestJobs({ className }: LatestJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch("/api/jobs?limit=8&status=ACTIVE")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJobs(
            data.data.map((job: Record<string, unknown>) => ({
              id: job.id as string,
              title: job.title as string,
              department: (job.department as { name: string })?.name ?? "",
              location: (job.location as string) ?? null,
              totalVacancies: (job.totalVacancies as number) ?? null,
              lastDateToApply: (job.lastDate as string) ?? null,
              salary: (job.salary as string) ?? null,
              status: job.status as "ACTIVE" | "EXPIRED" | "UPCOMING",
              slug: job.slug as string,
            }))
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayedJobs = showAll ? jobs : jobs.slice(0, 4)

  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Latest Government Jobs
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Recent job notifications from central and state governments
            </p>
          </div>
          <Link
            href="/jobs"
            className="group hidden items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedJobs.map((job) => (
              <div key={job.id}>
                <JobCard {...job} />
              </div>
            ))}
          </div>
        )}

        {jobs.length > 4 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="gap-2"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Load More ({jobs.length - 4} more) <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View All Jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
