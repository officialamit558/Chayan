"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, AlertCircle, Download, FileText, Book, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"

interface SyllabusData {
  id: string
  title: string
  slug: string
  description: string | null
  subjects: string | null
  pdfUrl: string | null
  status: string | null
  department: { id: string; name: string; slug: string }
}

interface PaginationData {
  page: number
  total: number
  totalPages: number
}

export function SyllabusClient() {
  const [items, setItems] = useState<SyllabusData[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      params.set("page", String(page))
      params.set("limit", "12")

      const res = await fetch(`/api/syllabus?${params}`)
      const json = await res.json()
      if (json.success) {
        setItems(json.data)
        setPagination(json.pagination)
      } else {
        setError(json.error || "Failed to fetch syllabus")
      }
    } catch {
      setError("Failed to fetch syllabus. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const getSubjectsList = (subjects: string | null): string[] => {
    if (!subjects) return []
    try {
      const parsed = JSON.parse(subjects)
      return Array.isArray(parsed) ? parsed.slice(0, 4) : [subjects]
    } catch {
      return subjects.split(",").map((s) => s.trim()).slice(0, 4)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Syllabus</h1>
        <p className="mb-8 text-gray-600">
          Download detailed subject-wise syllabus for government exams.
        </p>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search syllabus..."
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
              <Card key={i}>
                <CardContent className="p-5">
                  <Skeleton className="mb-3 h-5 w-20 rounded-full" />
                  <Skeleton className="mb-3 h-5 w-3/4" />
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="h-10 w-36" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Something went wrong</h3>
              <p className="mb-4 text-sm text-gray-500">{error}</p>
              <Button onClick={fetchItems}>Try Again</Button>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <Search className="mb-4 h-12 w-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No syllabus found</h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {items.length} of {pagination?.total ?? 0} syllabus entries
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full border-gray-200 transition-colors hover:border-blue-300 hover:shadow-md">
                    <CardHeader>
                      <Badge variant="secondary" className="mb-2 w-fit text-xs">
                        {item.department.name}
                      </Badge>
                      <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {item.subjects && getSubjectsList(item.subjects).length > 0 && (
                        <div className="mb-4">
                          <div className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
                            <Book className="h-3 w-3" />
                            Subjects
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {getSubjectsList(item.subjects).map((subject, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button asChild variant="default" size="sm">
                          <Link href={`/syllabus/${item.slug}`}>
                            <FileText className="mr-1 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                        {item.pdfUrl && (
                          <Button asChild variant="outline" size="sm">
                            <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-1 h-4 w-4" />
                              PDF
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
