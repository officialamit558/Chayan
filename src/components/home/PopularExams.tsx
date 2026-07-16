"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, ArrowRight, ExternalLink, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface ExamItem {
  id: string
  name: string
  slug: string
  description?: string | null
  categoryId: string
  category: { id: string; name: string; slug: string }
}

const GRADIENTS = [
  "from-purple-500 to-indigo-600",
  "from-teal-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-green-500 to-teal-600",
  "from-pink-500 to-rose-600",
  "from-red-500 to-amber-600",
  "from-cyan-500 to-sky-600",
  "from-emerald-500 to-green-600",
  "from-amber-500 to-orange-600",
  "from-indigo-500 to-purple-600",
]

function getGradient(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

export function PopularExams({ className }: { className?: string }) {
  const [exams, setExams] = useState<ExamItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchExams() {
      try {
        setLoading(true)
        setError("")
        const res = await fetch("/api/exams")
        const json = await res.json()
        if (!json.success) throw new Error(json.error || "Failed to fetch exams")
        setExams(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchExams()
  }, [])

  if (error) {
    return (
      <section className={cn("py-16", className)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Failed to load exams. Please try again later.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Popular Exams</h2>
            <p className="mt-1 text-sm text-gray-600">Upcoming examination schedules</p>
          </div>
          <Link
            href="/jobs"
            className="group hidden items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-x-auto pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-72 shrink-0">
                <Card className="overflow-hidden border-gray-200">
                  <Skeleton className="h-32 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : exams.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No exams available.</p>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-5" style={{ minWidth: "max-content" }}>
              {exams.map((exam, index) => (
                <div
                  key={exam.id}
                  className="w-72 shrink-0"
                >
                  <Link href={`/jobs?categoryId=${exam.categoryId}`} className="group block">
                    <Card className="overflow-hidden border-gray-200 transition-all hover:-translate-y-1 hover:shadow-xl">
                      <CardContent className="p-0">
                        <div className={cn("bg-gradient-to-r p-5 text-white", getGradient(exam.category?.name || exam.name))}>
                          <Badge variant="secondary" className="mb-2 bg-white/20 text-white hover:bg-white/30">
                            {exam.category?.name || "General"}
                          </Badge>
                          <h3 className="text-lg font-bold leading-tight">{exam.name}</h3>
                          {exam.description && (
                            <p className="mt-1 text-sm text-white/80">{exam.description}</p>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 font-medium text-teal-600 group-hover:text-teal-700">
                              View Jobs
                              <ExternalLink className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Browse All Exams
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
