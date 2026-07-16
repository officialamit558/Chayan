"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { MapPin, ArrowRight, Calendar, Users, Building2 } from "lucide-react"
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
  stateId?: string | null
}

interface StateItem {
  id: string
  name: string
  slug: string
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

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

export function JobsByState({ className }: { className?: string }) {
  const [states, setStates] = useState<StateItem[]>([])
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError("")
        const [statesRes, jobsRes] = await Promise.all([
          fetch("/api/states"),
          fetch("/api/jobs?limit=100"),
        ])
        const statesJson = await statesRes.json()
        const jobsJson = await jobsRes.json()
        if (!statesJson.success) throw new Error(statesJson.error || "Failed to fetch states")
        if (!jobsJson.success) throw new Error(jobsJson.error || "Failed to fetch jobs")
        setStates(statesJson.data)
        const mapped: JobItem[] = jobsJson.data.map((j: any) => ({
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
          stateId: j.stateId,
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

  const stateJobMap = useMemo(() => {
    const map = new Map<string, JobItem[]>()
    for (const job of jobs) {
      if (!job.stateId) continue
      const existing = map.get(job.stateId) || []
      existing.push(job)
      map.set(job.stateId, existing)
    }
    return map
  }, [jobs])

  const visibleJobs = useMemo(() => {
    if (!selectedStateId) return []
    return stateJobMap.get(selectedStateId) || []
  }, [selectedStateId, stateJobMap])

  const selectedState = useMemo(() => {
    if (!selectedStateId) return null
    return states.find((s) => s.id === selectedStateId) || null
  }, [selectedStateId, states])

  if (error) {
    return (
      <section className={cn("py-16", className)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Failed to load data. Please try again later.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Jobs by State</h2>
            <p className="mt-1 text-sm text-gray-600">Explore government job opportunities in your state</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-3">
                <Skeleton className="h-4 w-4 mb-2" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {states.map((state) => {
                const count = stateJobMap.get(state.id)?.length || 0
                return (
                  <button
                    key={state.id}
                    onClick={() => setSelectedStateId(selectedStateId === state.id ? null : state.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border p-3 text-left transition-all hover:shadow-md hover:-translate-y-0.5",
                      selectedStateId === state.id
                        ? "border-teal-500 bg-teal-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-teal-300"
                    )}
                  >
                    <MapPin className={cn("h-4 w-4 shrink-0", selectedStateId === state.id ? "text-teal-600" : "text-teal-500")} />
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-sm font-medium", selectedStateId === state.id ? "text-teal-700" : "text-gray-900")}>
                        {state.name}
                      </p>
                      <p className="text-xs text-gray-500">{formatCount(count)} jobs</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {states.length === 0 && !loading && (
              <p className="py-12 text-center text-gray-500">No states available.</p>
            )}

            {selectedState && (
              <div
                key={selectedState.id}
                className="mt-8"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Jobs in {selectedState.name}</h3>
                  <Link href={`/jobs?stateId=${selectedState.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1 text-teal-600">
                      View All <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                {visibleJobs.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">No jobs found for this state.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleJobs.slice(0, 6).map((job) => (
                      <Link key={job.id} href={`/apply/${job.slug}`} className="group block">
                        <Card className="h-full border-gray-200 transition-all hover:border-teal-300 hover:shadow-md hover:-translate-y-1">
                          <CardContent className="p-4">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="text-xs">{job.department}</Badge>
                              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_STYLES[job.status] || "bg-gray-100 text-gray-800")}>
                                {STATUS_LABELS[job.status] || job.status}
                              </span>
                            </div>
                            <h4 className="mb-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                              {job.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-600">
                              {job.totalVacancies != null && (
                                <span className="inline-flex items-center gap-1">
                                  <Users className="h-3 w-3 text-gray-400" />
                                  {job.totalVacancies}
                                </span>
                              )}
                              {job.lastDate && (
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-gray-400" />
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
              </div>
            )}

            <div className="mt-8 text-center">
              <Link href="/jobs">
                <Button variant="outline" className="gap-2">
                  Browse All Jobs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
