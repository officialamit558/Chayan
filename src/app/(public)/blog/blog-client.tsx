"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, AlertCircle, Calendar, Clock, ArrowRight, X } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { AdBanner } from "@/components/ads/AdBanner"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  author: string | null
  image: string | null
  tags: string | null
  published: boolean
  views: number
  createdAt: string
}

export function BlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [pagination, setPagination] = useState<{ page: number; total: number; totalPages: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      params.set("published", "true")
      params.set("page", String(page))
      params.set("limit", "12")
      const res = await fetch(`/api/blog?${params}`)
      const json = await res.json()
      if (json.success) {
        setPosts(json.data)
        setPagination(json.pagination)
      } else {
        setError(json.error || "Failed to fetch posts")
      }
    } catch {
      setError("Failed to load blog posts.")
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Chayan Blog</h1>
        <p className="mb-8 text-gray-600">
          Exam preparation guides, government job tips, and latest updates.
        </p>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search articles..."
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <Skeleton className="mb-3 h-4 w-24" />
                  <Skeleton className="mb-2 h-5 w-full" />
                  <Skeleton className="mb-4 h-4 w-3/4" />
                  <Skeleton className="h-4 w-32" />
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
              <Button onClick={fetchPosts}>Try Again</Button>
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <Search className="mb-4 h-12 w-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No articles yet</h3>
              <p className="text-sm text-gray-500">Check back soon for new blog posts.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {posts.length} of {pagination?.total ?? 0} articles
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="h-full border-gray-200 transition-all hover:border-blue-300 hover:shadow-md">
                      <CardHeader>
                        <div className="mb-2 flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.createdAt)}
                          </span>
                          {post.author && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.author}
                            </span>
                          )}
                        </div>
                        {post.image && (
                          <div className="mb-3 -mx-6 -mt-4 overflow-hidden">
                            <img src={post.image} alt={post.title} className="h-40 w-full object-cover" />
                          </div>
                        )}
                        <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {post.excerpt && (
                          <p className="mb-4 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                        )}
                        <div className="flex items-center text-sm font-medium text-blue-600">
                          Read More <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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
