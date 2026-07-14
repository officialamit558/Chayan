"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Loader2, AlertCircle, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { JobCard, JobCardSkeleton } from "@/components/home/JobCard"
import { AdBanner } from "@/components/ads/AdBanner"

interface FilterOption {
  id: string
  name: string
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
  limit: number
  total: number
  totalPages: number
}

export function JobsClient() {
  const [jobs, setJobs] = useState<JobData[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const [categories, setCategories] = useState<FilterOption[]>([])
  const [departments, setDepartments] = useState<FilterOption[]>([])
  const [states, setStates] = useState<FilterOption[]>([])

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/departments").then((r) => r.json()),
      fetch("/api/states").then((r) => r.json()),
    ])
      .then(([catRes, depRes, stateRes]) => {
        if (catRes.success) setCategories(catRes.data)
        if (depRes.success) setDepartments(depRes.data)
        if (stateRes.success) setStates(stateRes.data)
      })
      .catch(() => {})
  }, [])

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (selectedCategory) params.set("categoryId", selectedCategory)
      if (selectedDepartment) params.set("departmentId", selectedDepartment)
      if (selectedState) params.set("stateId", selectedState)
      if (selectedStatus) params.set("status", selectedStatus)
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
  }, [search, selectedCategory, selectedDepartment, selectedState, selectedStatus, page])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchJobs()
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedDepartment("")
    setSelectedState("")
    setSelectedStatus("")
    setSearch("")
    setPage(1)
  }

  const hasActiveFilters = selectedCategory || selectedDepartment || selectedState || selectedStatus || search

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Latest Government Jobs</h1>
        <p className="mb-8 text-gray-600">
          Browse and apply to the latest government job notifications across India.
        </p>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          </form>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className={`mb-6 flex-col gap-4 sm:flex-row ${showFilters ? "flex" : "hidden sm:flex"}`}>
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1) }}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => { setSelectedDepartment(e.target.value); setPage(1) }}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <select
            value={selectedState}
            onChange={(e) => { setSelectedState(e.target.value); setPage(1) }}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setPage(1) }}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="UPCOMING">Upcoming</option>
          </select>
        </div>

        <AdBanner format="horizontal" />

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
                Try adjusting your search or filter criteria.
              </p>
              {hasActiveFilters && <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>}
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
