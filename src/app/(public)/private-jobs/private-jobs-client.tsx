"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, AlertCircle, Calendar, MapPin, IndianRupee, Briefcase, ExternalLink, X } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { BookmarkButton } from "@/components/layout/BookmarkButton"

interface Company {
  id: string; name: string; logo?: string | null
}

interface PrivateJobData {
  id: string; title: string; slug: string; type: string; category?: string | null
  description?: string | null; location?: string | null; salary?: string | null
  experience?: string | null; applicationUrl?: string | null
  applicationEmail?: string | null; lastDate?: string | null; status: string
  company: Company; createdAt: string
}

interface PaginationData {
  page: number; total: number; totalPages: number
}

const typeLabels: Record<string, string> = {
  FULL_TIME: "Full-Time", PART_TIME: "Part-Time", INTERNSHIP: "Internship", CONTRACT: "Contract",
}

export function PrivateJobsClient() {
  const [jobs, setJobs] = useState<PrivateJobData[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchJobs = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.set("search", debouncedSearch)
      if (typeFilter) params.set("type", typeFilter)
      params.set("page", String(page))
      params.set("limit", "12")

      const res = await fetch(`/api/private-jobs?${params}`, { signal })
      const json = await res.json()
      if (json.success) {
        setJobs(json.data)
        setPagination(json.pagination)
      } else {
        setError(json.error || "Failed to fetch private jobs")
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      setError("Failed to fetch private jobs. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, typeFilter, page])

  useEffect(() => {
    const controller = new AbortController()
    fetchJobs(controller.signal)
    return () => controller.abort()
  }, [fetchJobs])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Private Jobs</h1>
        <p className="mb-8 text-gray-600">
          Full-time, part-time, internships, and contract positions from top companies.
        </p>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by title or company..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-10 pr-10"
            />
            {search && (
              <button type="button" onClick={() => { setSearch(""); setPage(1) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(["", "FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"] as const).map((t) => (
              <Button
                key={t}
                variant={typeFilter === t ? "default" : "outline"}
                size="sm"
                onClick={() => { setTypeFilter(t); setPage(1) }}
                className={typeFilter === t ? "bg-teal-600 hover:bg-teal-700" : ""}
              >
                {t ? typeLabels[t] : "All"}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardContent className="p-5">
                <Skeleton className="mb-3 h-5 w-24 rounded-full" />
                <Skeleton className="mb-3 h-5 w-3/4" />
                <Skeleton className="mb-1 h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardContent></Card>
            ))}
          </div>
        ) : error ? (
          <Card><CardContent className="flex flex-col items-center py-16">
            <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
            <h3 className="mb-2 text-lg font-semibold">Something went wrong</h3>
            <p className="mb-4 text-sm text-gray-500">{error}</p>
            <Button onClick={() => fetchJobs()}>Try Again</Button>
          </CardContent></Card>
        ) : jobs.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center py-16">
            <Briefcase className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold">No private jobs found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or check back later.</p>
          </CardContent></Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {jobs.length} of {pagination?.total ?? 0} private jobs
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Card className="h-full border-gray-200 transition-colors hover:border-teal-300 hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="outline" className="text-xs">{typeLabels[job.type]}</Badge>
                        <BookmarkButton privateJobId={job.id} variant="ghost" />
                      </div>
                      <CardTitle className="text-base leading-snug">{job.title}</CardTitle>
                      <p className="text-sm font-medium text-teal-700">{job.company.name}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 space-y-2 text-sm text-gray-600">
                        {job.location && (
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gray-400" />{job.location}</span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5 text-gray-400" />{job.salary}</span>
                        )}
                        {job.experience && (
                          <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-gray-400" />{job.experience}</span>
                        )}
                        {job.lastDate && (
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-gray-400" />Last: {formatDate(job.lastDate)}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="default" size="sm">
                          <Link href={`/private-jobs/${job.slug}`}>
                            <ExternalLink className="mr-1 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}