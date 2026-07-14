"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, AlertCircle, Calendar, Download, FileText, X } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { AdBanner } from "@/components/ads/AdBanner"

interface AdmitCardData {
  id: string
  title: string
  slug: string
  examDate: string | null
  downloadUrl: string | null
  status: string | null
  department: { id: string; name: string; slug: string }
}

interface PaginationData {
  page: number
  total: number
  totalPages: number
}

export function AdmitCardsClient() {
  const [items, setItems] = useState<AdmitCardData[]>([])
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

      const res = await fetch(`/api/admit-cards?${params}`)
      const json = await res.json()
      if (json.success) {
        setItems(json.data)
        setPagination(json.pagination)
      } else {
        setError(json.error || "Failed to fetch admit cards")
      }
    } catch {
      setError("Failed to fetch admit cards. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Admit Cards</h1>
        <p className="mb-8 text-gray-600">
          Download admit cards and hall tickets for upcoming government exams.
        </p>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search admit cards..."
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

        <AdBanner format="horizontal" />

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
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No admit cards found</h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {items.length} of {pagination?.total ?? 0} admit cards
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
                      <div className="mb-4 space-y-2 text-sm text-gray-600">
                        {item.examDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            Exam Date: {formatDate(item.examDate)}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="default" size="sm">
                          <Link href={`/admit-card/${item.slug}`}>
                            <FileText className="mr-1 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                        {item.downloadUrl && (
                          <Button asChild variant="outline" size="sm">
                            <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-1 h-4 w-4" />
                              Download
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
