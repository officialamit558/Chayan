"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Calendar, MapPin, Users, Building2, ArrowRight } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface JobItem {
  id: string
  title: string
  slug: string
  department: string
  education?: string | null
  totalVacancies?: number | null
  lastDate?: string | null
  status: string
  location?: string | null
  salary?: string | null
}

const QUALIFICATION_KEYWORDS = [
  "10th", "12th", "Graduate", "Post Graduate", "Diploma", "ITI", "Ph.D", "PhD", "Engineering",
]

function extractQualifications(education?: string | null): string[] {
  if (!education) return []
  const found: string[] = []
  const normalized = education.replace(/\s*,\s*/g, ",").replace(/\s*;\s*/g, ",").replace(/\n/g, ",")
  const parts = normalized.split(",").map((s) => s.trim()).filter(Boolean)
  for (const keyword of QUALIFICATION_KEYWORDS) {
    if (parts.some((p) => p.toLowerCase().includes(keyword.toLowerCase()))) {
      found.push(keyword)
    }
  }
  return found
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  EXPIRED: "bg-red-100 text-red-800",
  UPCOMING: "bg-yellow-100 text-yellow-800",
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  EXPIRED: "Expired",
  UPCOMING: "Upcoming",
}

export function JobsByQualification({ className }: { className?: string }) {
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedQual, setSelectedQual] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError("")
        const res = await fetch("/api/jobs?limit=10")
        const json = await res.json()
        if (!json.success) throw new Error(json.error || "Failed to fetch jobs")
        const mapped: JobItem[] = json.data.map((j: any) => ({
          id: j.id,
          title: j.title,
          slug: j.slug,
          department: j.department?.name || "",
          education: j.education,
          totalVacancies: j.totalVacancies,
          lastDate: j.lastDate,
          status: j.status,
          location: j.location,
          salary: j.salary,
        }))
        setJobs(mapped)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const qualifications = useMemo(() => {
    const set = new Set<string>()
    for (const job of jobs) {
      for (const q of extractQualifications(job.education)) {
        set.add(q)
      }
    }
    return Array.from(set)
  }, [jobs])

  useEffect(() => {
    if (qualifications.length > 0 && !selectedQual) {
      setSelectedQual(qualifications[0])
    }
  }, [qualifications, selectedQual])

  const filteredJobs = useMemo(() => {
    if (!selectedQual) return jobs
    return jobs.filter((job) => {
      const extracted = extractQualifications(job.education)
      return extracted.includes(selectedQual)
    })
  }, [jobs, selectedQual])

  if (error) {
    return (
      <section className={cn("bg-gray-50 py-16", className)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Failed to load jobs. Please try again later.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("bg-gray-50 py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Jobs by Qualification</h2>
            <p className="mt-1 text-sm text-gray-600">Find government jobs matching your educational qualification</p>
          </div>
          <Link
            href="/jobs"
            className="group hidden items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="flex gap-2 pb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-gray-200">
                  <CardContent className="p-5">
                    <div className="mb-3 flex gap-2">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="mb-3 h-5 w-3/4" />
                    <div className="flex flex-wrap gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <>
            {qualifications.length > 0 && (
              <div className="mb-8 overflow-x-auto">
                <div className="flex gap-2 pb-2">
                  {qualifications.map((qual) => (
                    <button
                      key={qual}
                      onClick={() => setSelectedQual(qual)}
                      className={cn(
                        "whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all",
                        selectedQual === qual
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200"
                      )}
                    >
                      {qual === "Ph.D" ? "PhD" : qual}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredJobs.length === 0 ? (
              <p className="py-12 text-center text-gray-500">No jobs found for this qualification.</p>
            ) : (
              <div
                key={selectedQual}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {filteredJobs.slice(0, 4).map((job) => (
                  <Link key={job.id} href={`/apply/${job.slug}`} className="group block">
                    <Card className="h-full border-gray-200 transition-all hover:border-blue-300 hover:shadow-md hover:-translate-y-1">
                      <CardContent className="p-5">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{job.department}</Badge>
                          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[job.status] || "bg-gray-100 text-gray-800")}>
                            {STATUS_LABELS[job.status] || job.status}
                          </span>
                        </div>
                        <h3 className="mb-3 text-base font-semibold leading-snug text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                          {job.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              {job.location}
                            </span>
                          )}
                          {job.totalVacancies != null && (
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3.5 w-3.5 text-gray-400" />
                              {job.totalVacancies} Vacanc{job.totalVacancies === 1 ? "y" : "ies"}
                            </span>
                          )}
                          {job.lastDate && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              {formatDate(job.lastDate)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {qualifications.length > 0 && (
              <div className="mt-6 text-center">
                <Link href={`/jobs?qualification=${selectedQual}`}>
                  <Button variant="outline" className="gap-2">
                    View All {selectedQual === "Ph.D" ? "PhD" : selectedQual} Jobs
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
