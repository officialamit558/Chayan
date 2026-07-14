"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Eye, TrendingUp, Clock, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { formatDate, truncate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  slug: string
  content: string | null
  type: string | null
  isTrending: boolean
  views: number
  createdAt: string
  category: { id: string; name: string; slug: string }
}

interface Category {
  id: string
  name: string
  slug: string
}

interface NotificationsClientProps {
  notifications: Notification[]
  categories: Category[]
}

type FilterType = "all" | "trending" | "category"

export function NotificationsClient({ notifications: initialNotifications, categories }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(notifications.length >= 20)
  const perPage = 10

  const filteredNotifications = useMemo(() => {
    let result = [...notifications]

    if (filter === "trending") {
      result = result.filter((n) => n.isTrending)
    }

    if (filter === "category" && selectedCategory) {
      result = result.filter((n) => n.category.id === selectedCategory)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.category.name.toLowerCase().includes(q) ||
          (n.content && n.content.toLowerCase().includes(q))
      )
    }

    return result
  }, [notifications, filter, selectedCategory, search])

  const paginatedNotifications = filteredNotifications.slice(0, page * perPage)
  const hasMoreFiltered = filteredNotifications.length > paginatedNotifications.length

  async function loadMore() {
    setIsLoadingMore(true)
    try {
      const res = await fetch(`/api/notifications?page=${Math.ceil((page * perPage) / 10) + 1}&limit=10`)
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data.length > 0) {
          setNotifications((prev) => {
            const existing = new Set(prev.map((n) => n.id))
            const newItems = json.data.filter((n: Notification) => !existing.has(n.id))
            return [...prev, ...newItems]
          })
          setPage((p) => p + 1)
          setHasMore(json.data.length >= 10)
        } else {
          setHasMore(false)
        }
      }
    } catch {
      setHasMore(false)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">All Notifications</h1>
        <p className="mb-8 text-gray-600">
          Stay updated with the latest government job notifications and announcements.
        </p>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => { setFilter("all"); setSelectedCategory("") }}
          >
            All
          </Button>
          <Button
            variant={filter === "trending" ? "default" : "outline"}
            size="sm"
            onClick={() => { setFilter("trending"); setSelectedCategory("") }}
          >
            <TrendingUp className="mr-1 h-4 w-4" />
            Trending
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={filter === "category" && selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilter("category"); setSelectedCategory(cat.id) }}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {paginatedNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <Search className="mb-4 h-12 w-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No notifications found</h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paginatedNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="border-gray-200 transition-colors hover:border-blue-200">
                  <CardContent className="p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {notification.category.name}
                      </Badge>
                      {notification.isTrending && (
                        <Badge variant="default" className="text-xs">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{notification.title}</h3>
                    {notification.content && (
                      <p className="mb-3 text-sm text-gray-600">{truncate(notification.content, 200)}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(notification.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {notification.views} views
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {(hasMore || hasMoreFiltered) && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={loadMore} disabled={isLoadingMore}>
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More
                  <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
