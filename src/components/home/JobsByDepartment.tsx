"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
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
  departmentId?: string | null
}

interface DepartmentItem {
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

const DEPT_GRADIENTS: string[] = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-orange-500 to-orange-600",
  "from-green-500 to-green-600",
  "from-red-500 to-red-600",
  "from-teal-500 to-teal-600",
  "from-indigo-500 to-indigo-600",
  "from-cyan-500 to-cyan-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-sky-500 to-sky-600",
  "from-lime-500 to-lime-600",
]

function getGradient(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return DEPT_GRADIENTS[Math.abs(hash) % DEPT_GRADIENTS.length]
}

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K+`
  return count.toString()
}

export function JobsByDepartment({ className }: { className?: string }) {
  const [departments, setDepartments] = useState<DepartmentItem[]>([])
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError("")
        const [deptRes, jobsRes] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/jobs?limit=100"),
        ])
        const deptJson = await deptRes.json()
        const jobsJson = await jobsRes.json()
        if (!deptJson.success) throw new Error(deptJson.error || "Failed to fetch departments")
        if (!jobsJson.success) throw new Error(jobsJson.error || "Failed to fetch jobs")
        setDepartments(deptJson.data)
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
          departmentId: j.departmentId,
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

  const deptJobMap = useMemo(() => {
    const map = new Map<string, JobItem[]>()
    for (const job of jobs) {
      if (!job.departmentId) continue
      const existing = map.get(job.departmentId) || []
      existing.push(job)
      map.set(job.departmentId, existing)
    }
    return map
  }, [jobs])

  if (error) {
    return (
      <section className={cn("bg-gray-50 py-16", className)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Failed to load data. Please try again later.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("bg-gray-50 py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Jobs by Department</h2>
            <p className="mt-1 text-sm text-gray-600">Browse job openings by department or category</p>
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
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border-gray-200 overflow-hidden">
                <Skeleton className="h-32 w-full" />
                <CardContent className="p-3">
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {departments.map((dept) => {
                const count = deptJobMap.get(dept.id)?.length || 0
                return (
                  <div key={dept.id}>
                    <Link
                      href={`/jobs?departmentId=${dept.id}`}
                      className="group block"
                    >
                      <Card className={cn(
                        "overflow-hidden border-gray-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      )}>
                        <CardContent className="p-0">
                          <div className={cn("bg-gradient-to-r p-4 text-white", getGradient(dept.name))}>
                            <Building2 className="h-6 w-6 mb-1" />
                            <h3 className="mt-1 text-lg font-bold">{dept.name}</h3>
                            {count > 0 && (
                              <p className="text-sm opacity-90">{formatCount(count)} Jobs</p>
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 text-sm">
                            <span className="text-gray-600">{count > 0 ? `${count} openings` : "No openings"}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                )
              })}
            </div>

            {departments.length === 0 && !loading && (
              <p className="py-12 text-center text-gray-500">No departments available.</p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
