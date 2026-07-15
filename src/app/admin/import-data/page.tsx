"use client"

import { useState } from "react"
import { Briefcase, IdCard, FileText, GraduationCap, Book, Key, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FetchResult {
  source: string
  success: boolean
  imported: number
  skipped: number
  errors: string[]
}

interface ImportConfig {
  id: string
  label: string
  description: string
  icon: string
  listingUrl: string
}

const importers: ImportConfig[] = [
  { id: "jobs", label: "Job Fetcher", description: "Government job notifications", icon: "Briefcase", listingUrl: "https://sarkariresult.com.cm/latest-jobs/" },
  { id: "admit-cards", label: "Admit Card Fetcher", description: "Admit card releases and exam dates", icon: "IdCard", listingUrl: "https://sarkariresult.com.cm/admit-card/" },
  { id: "results", label: "Result Fetcher", description: "Exam results and answer keys", icon: "FileText", listingUrl: "https://sarkariresult.com.cm/result/" },
  { id: "admissions", label: "Admission Fetcher", description: "Admission notifications and applications", icon: "GraduationCap", listingUrl: "https://sarkariresult.com.cm/admission/" },
  { id: "syllabus", label: "Syllabus Fetcher", description: "Exam syllabus and patterns", icon: "Book", listingUrl: "https://sarkariresult.com.cm/syllabus/" },
  { id: "answer-keys", label: "Answer Key Fetcher", description: "Exam answer keys and solutions", icon: "Key", listingUrl: "https://sarkariresult.com.cm/answer-key/" },
]

const iconMap: Record<string, React.ElementType> = { Briefcase, IdCard, FileText, GraduationCap, Book, Key }

export default function ImportDataPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, FetchResult>>({})
  const [globalLoading, setGlobalLoading] = useState(false)

  async function handleImport(type: string) {
    setLoading(type)
    try {
      const res = await fetch("/api/admin/import-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setResults(prev => {
        const r = data.results[0] as FetchResult
        return { ...prev, [type]: r }
      })
    } catch (e) {
      setResults(prev => ({
        ...prev,
        [type]: { source: type, success: false, imported: 0, skipped: 0, errors: [e instanceof Error ? e.message : "Unknown error"] },
      }))
    } finally {
      setLoading(null)
    }
  }

  async function handleImportAll() {
    setGlobalLoading(true)
    try {
      const res = await fetch("/api/admin/import-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      const newResults: Record<string, FetchResult> = {}
      for (const r of data.results as FetchResult[]) {
        const key = r.source.toLowerCase().replace(/\s+/g, "-")
        newResults[key] = r
      }
      setResults(newResults)
    } catch (e) {
      console.error(e)
    } finally {
      setGlobalLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Import Data</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Fetch content from <span className="font-medium text-gray-700">sarkariresult.com.cm</span> into your database.
            Each importer processes up to 15 records per run and automatically skips duplicates.
          </p>
        </div>
        <Button
          onClick={handleImportAll}
          disabled={globalLoading || loading !== null}
          size="default"
          className="gap-2 shrink-0"
        >
          {globalLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Importing All...</>
          ) : (
            <><Loader2 className="h-4 w-4" /> Import All</>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {importers.map((imp) => {
          const result = results[imp.id]
          const isActive = loading === imp.id
          const Icon = iconMap[imp.icon] || Briefcase

          return (
            <Card
              key={imp.id}
              className={cn(
                "relative transition-shadow duration-200",
                isActive && "ring-2 ring-blue-400 shadow-md",
                result && result.success && "ring-1 ring-green-200",
                result && !result.success && "ring-1 ring-red-200",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  {result && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs border-0",
                        result.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}
                    >
                      {result.success ? (
                        <><CheckCircle2 className="mr-1 h-3 w-3" /> Done</>
                      ) : (
                        <><XCircle className="mr-1 h-3 w-3" /> Failed</>
                      )}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-3 text-base">{imp.label}</CardTitle>
                <CardDescription className="text-xs">{imp.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-3">
                    <div className="flex gap-3 text-center">
                      <div className="flex-1 rounded-md bg-green-50 p-2">
                        <div className="text-lg font-bold text-green-700">{result.imported}</div>
                        <div className="text-[11px] text-green-600 font-medium">Imported</div>
                      </div>
                      <div className="flex-1 rounded-md bg-blue-50 p-2">
                        <div className="text-lg font-bold text-blue-700">{result.skipped}</div>
                        <div className="text-[11px] text-blue-600 font-medium">Skipped</div>
                      </div>
                      <div className="flex-1 rounded-md bg-red-50 p-2">
                        <div className="text-lg font-bold text-red-700">{result.errors.length}</div>
                        <div className="text-[11px] text-red-600 font-medium">Errors</div>
                      </div>
                    </div>
                    {result.errors.length > 0 && (
                      <div className="max-h-20 overflow-y-auto rounded-md border border-red-100 bg-red-50 p-2 text-xs text-red-700 space-y-1">
                        {result.errors.map((e, i) => (
                          <p key={i}>{e}</p>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handleImport(imp.id)}
                      disabled={isActive || globalLoading}
                    >
                      {isActive ? "Importing..." : "Import Again"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleImport(imp.id)}
                    disabled={isActive || globalLoading}
                  >
                    {isActive ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Importing...</>
                    ) : (
                      <><Loader2 className="h-4 w-4" /> Run Import</>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
