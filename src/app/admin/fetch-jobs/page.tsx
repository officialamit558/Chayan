"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FetchResult {
  source: string
  success: boolean
  imported: number
  skipped: number
  errors: string[]
}

export default function FetchJobsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<FetchResult[] | null>(null)
  const [error, setError] = useState("")

  async function handleFetch(all: boolean) {
    setLoading(true)
    setError("")
    setResults(null)
    try {
      const res = await fetch("/api/admin/fetch-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(all ? {} : { source: "govtjobsblog.in" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setResults(data.results)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Import Jobs from External Sources</h1>
        <p className="text-gray-500">Fetch job listings from RSS feeds and other sources.</p>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => handleFetch(false)} disabled={loading}>
          {loading ? "Importing..." : "Import from govtjobsblog.in"}
        </Button>
        <Button onClick={() => handleFetch(true)} disabled={loading} variant="outline">
          {loading ? "Importing..." : "Import All Sources"}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-red-700">{error}</CardContent>
        </Card>
      )}

      {results && results.map((r, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="text-lg">{r.source}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{r.imported}</div>
                <div className="text-sm text-green-600">Imported</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{r.skipped}</div>
                <div className="text-sm text-blue-600">Skipped (duplicates)</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">{r.errors.length}</div>
                <div className="text-sm text-red-600">Errors</div>
              </div>
            </div>
            {r.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Errors:</h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {r.errors.map((e, j) => <li key={j}>{e}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
