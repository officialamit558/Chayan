"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Flame, Eye, Calendar, ArrowRight } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Notification {
  id: string
  title: string
  date: string
  category: string
  views: number
  slug: string
}

function formatViews(views: number): string {
  if (views >= 100000) return `${(views / 100000).toFixed(1)}L`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

export function TrendingNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/notifications?limit=6&isTrending=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications(
            data.data.map((item: Record<string, unknown>) => ({
              id: item.id as string,
              title: item.title as string,
              date: (item.createdAt as string) || (item.date as string),
              category: (item.category as { name: string }).name,
              views: item.views as number,
              slug: item.slug as string,
            }))
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className={cn("bg-gray-50 py-16")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Trending Notifications
            </h2>
          </div>
          <Link
            href="/notifications"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-gray-200">
                <CardContent className="flex items-center gap-3 p-3">
                  <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-12 shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No trending notifications right now.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            className="space-y-2"
          >
            {notifications.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, x: -15 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                }}
              >
                <Link href="/notifications" className="block">
                  <Card className="border-gray-200 transition-all hover:border-orange-200 hover:shadow-sm">
                    <CardContent className="flex items-center gap-3 p-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-500">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 leading-normal">
                            {item.category}
                          </Badge>
                          <span className="text-[10px] text-gray-400">
                            {formatDate(item.date)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-gray-900 line-clamp-1">
                          {item.title}
                        </p>
                      </div>
                      <span className="flex shrink-0 items-center gap-0.5 text-[10px] text-gray-400">
                        <Eye className="h-3 w-3" />
                        {formatViews(item.views)}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
