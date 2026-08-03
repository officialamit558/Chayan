"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, AlertCircle, Calendar, Clock, ArrowRight, X, Newspaper, Eye, Flame } from "lucide-react"
import { SectionHero } from "@/components/layout/SectionHero"
import { formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { AdBanner } from "@/components/ads/AdBanner"

interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  author: string | null
  image: string | null
  tags: string | null
  categoryId: string | null
  category: { id: string; name: string; slug: string; color: string | null } | null
  published: boolean
  views: number
  content?: string | null
  createdAt: string
}

const readingTime = (content?: string | null): number => {
  if (!content) return 2
  return Math.max(1, Math.round(content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length / 200))
}

export function BlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [popular, setPopular] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [pagination, setPagination] = useState<{ page: number; total: number; totalPages: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch("/api/blog-categories")
      .then((res) => res.json())
      .then((json) => { if (json.success) setCategories(json.data) })
      .catch(() => {})
  }, [])

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (activeCategory) params.set("category", activeCategory)
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
  }, [search, activeCategory, page])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  useEffect(() => {
    if (activeCategory || search) { setPopular([]); return }
    fetch("/api/blog?sort=popular&published=true&limit=4")
      .then((res) => res.json())
      .then((json) => { if (json.success) setPopular(json.data) })
      .catch(() => {})
  }, [activeCategory, search])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHero
          icon={Newspaper}
          badge="Blog"
          title="Chayan Blog"
          subtitle="Guides on careers, AI, money, learning and productivity — plus exam and job updates."
          count={pagination?.total}
        />

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setActiveCategory(null); setPage(1) }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                !activeCategory
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setActiveCategory(activeCategory === cat.slug ? null : cat.slug); setPage(1) }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {popular.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
              <Flame className="h-4 w-4 text-orange-500" /> Trending on Chayan
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                    {post.category && <Badge variant="secondary" className="text-[10px]">{post.category.name}</Badge>}
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views}</span>
                  </div>
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-orange-600 dark:text-gray-100">{post.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdBanner slot="listInline" format="horizontal" />

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
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No articles found</h3>
              <p className="text-sm text-gray-500">Try a different search or category.</p>
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
                  <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
                    <Card className="flex h-full flex-col overflow-hidden border-gray-200 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 dark:hover:shadow-none">
                      {post.image && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                      )}
                      <CardHeader className={post.image ? "pt-4" : ""}>
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                          {post.category && (
                            <Link href={`/blog/topic/${post.category.slug}`} onClick={(e) => e.stopPropagation()} className="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300">
                              {post.category.name}
                            </Link>
                          )}
                        </div>
                        <CardTitle className="line-clamp-2 text-lg leading-snug text-gray-900 group-hover:text-blue-700 dark:text-gray-100">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="mt-auto">
                        {post.excerpt && (
                          <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(post.createdAt)}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {readingTime(post.content)} min</span>
                          </span>
                          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views}</span>
                        </div>
                        <div className="mt-3 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
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