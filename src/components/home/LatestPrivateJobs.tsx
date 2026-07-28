"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, ChevronUp, MapPin, Briefcase, IndianRupee, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Company {
  id: string
  name: string
  slug: string
  logo?: string | null
}

interface PrivateJob {
  id: string
  title: string
  slug: string
  type: string
  category?: string | null
  description?: string | null
  location?: string | null
  salary?: string | null
  experience?: string | null
  status: string
  createdAt: string
  company: Company
}

export function LatestPrivateJobs({ className }: { className?: string }) {
  const [jobs, setJobs] = useState<PrivateJob[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch("/api/private-jobs?limit=8&status=ACTIVE")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setJobs(data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayed = showAll ? jobs : jobs.slice(0, 4)

  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Latest Private Jobs
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Top opportunities from leading companies
            </p>
          </div>
          <Link
            href="/private-jobs"
            className="group hidden items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex gap-3">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No private jobs available right now.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {displayed.map((job) => (
              <Link key={job.id} href={`/private-jobs/${job.slug}`} className="group block">
                <Card className="border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-semibold text-sm">
                        {job.company.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">{job.company.name}</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{job.type.replace("_", " ")}</Badge>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          {job.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              {job.location}
                            </span>
                          )}
                          {job.salary && (
                            <span className="inline-flex items-center gap-1">
                              <IndianRupee className="h-3 w-3 text-gray-400" />
                              {job.salary}
                            </span>
                          )}
                          {job.experience && (
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="h-3 w-3 text-gray-400" />
                              {job.experience}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {jobs.length > 4 && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setShowAll(!showAll)} className="gap-2">
              {showAll ? (
                <>Show Less <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Load More ({jobs.length - 4} more) <ChevronDown className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link href="/private-jobs" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
            View All Private Jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
