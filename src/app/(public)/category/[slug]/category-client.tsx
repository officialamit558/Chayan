"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, AlertCircle, Loader2, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { JobCard, JobCardSkeleton } from "@/components/home/JobCard"

interface CategoryInfo {
  id: string
  name: string
  slug: string
  jobCount: number
}

interface JobData {
  id: string
  title: string
  slug: string
  department: { id: string; name: string; slug: string }
  category: { id: string; name: string; slug: string }
  state: { id: string; name: string; slug: string } | null
  location: string | null
  totalVacancies: number | null
  lastDate: string | null
  salary: string | null
  status: "ACTIVE" | "EXPIRED" | "UPCOMING"
}

interface PaginationData {
  page: number
  total: number
  totalPages: number
}

export function CategoryClient({ category }: { category: CategoryInfo }) {
  const [jobs, setJobs] = useState<JobData[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      params.set("categoryId", category.id)
      if (search) params.set("search", search)
      params.set("page", String(page))
      params.set("limit", "12")

      const res = await fetch(`/api/jobs?${params}`)
      const json = await res.json()
      if (json.success) {
        setJobs(json.data)
        setPagination(json.pagination)
      } else {
        setError(json.error || "Failed to fetch jobs")
      }
    } catch {
      setError("Failed to fetch jobs. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [category.id, search, page])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Jobs
            </Link>
          </Button>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{category.name} Jobs</h1>
          <p className="text-gray-600">
            {category.jobCount} job{category.jobCount !== 1 ? "s" : ""} available in {category.name} category
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-10 pr-10"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Something went wrong</h3>
              <p className="mb-4 text-sm text-gray-500">{error}</p>
              <Button onClick={fetchJobs}>Try Again</Button>
            </CardContent>
          </Card>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <Search className="mb-4 h-12 w-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No jobs found</h3>
              <p className="mb-4 text-sm text-gray-500">
                {search ? "Try adjusting your search." : `No ${category.name} jobs available right now. Check back later.`}
              </p>
              {search && (
                <Button variant="outline" onClick={() => { setSearch(""); setPage(1) }}>
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {jobs.length} of {pagination?.total ?? 0} jobs
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <JobCard
                    id={job.id}
                    title={job.title}
                    department={job.department.name}
                    departmentSlug={job.department.slug}
                    location={job.location || job.state?.name}
                    totalVacancies={job.totalVacancies}
                    lastDateToApply={job.lastDate}
                    salary={job.salary}
                    status={job.status}
                    slug={job.slug}
                  />
                </motion.div>
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
