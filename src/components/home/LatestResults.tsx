"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Download, Calendar, Building2 } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Result {
  id: string
  title: string
  department: string
  resultDate: string
  pdfUrl?: string
  slug: string
}

export function LatestResults() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/results?limit=4")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResults(
            data.data.map((item: Record<string, unknown>) => ({
              id: item.id as string,
              title: item.title as string,
              department: (item.department as { name: string })?.name ?? "",
              resultDate: item.resultDate as string,
              pdfUrl: item.pdfUrl as string | undefined,
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Latest Results
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Recently published examination results
            </p>
          </div>
          <Link
            href="/results"
            className="group hidden items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-gray-200">
                <CardContent className="p-5">
                  <Skeleton className="mb-3 h-5 w-3/4" />
                  <Skeleton className="mb-3 h-4 w-1/2" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No results published yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {results.map((result) => (
              <div key={result.id}>
                <Card className="group border-gray-200 transition-all hover:border-blue-300 hover:shadow-md">
                  <CardContent className="p-5">
                    <Link href={`/result/${result.slug}`}>
                      <h3 className="mb-2 text-base font-semibold text-gray-900 line-clamp-2 transition-colors group-hover:text-blue-700">
                        {result.title}
                      </h3>
                    </Link>
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span>{result.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(result.resultDate)}</span>
                      </div>
                      {result.pdfUrl ? (
                        <Button size="sm" variant="outline" className="gap-1.5" asChild>
                          <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                            Download PDF
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/results"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All Results
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
