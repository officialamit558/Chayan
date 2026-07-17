"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, Award, CreditCard, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  type: "job" | "result" | "admit_card"
  slug: string
  category?: string
}

const typeConfig = {
  job: { icon: FileText, label: "Jobs", href: "/jobs" },
  result: { icon: Award, label: "Results", href: "/results" },
  admit_card: { icon: CreditCard, label: "Admit Cards", href: "/admit-cards" },
} as const

function SearchContent({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const performSearch = React.useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setError("")
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`, {
        signal: controller.signal,
      })
      if (!res.ok) throw new Error("Search failed")
      const json = await res.json()
      if (controller.signal.aborted) return

      const items: SearchResult[] = []
      if (json.data?.jobs) {
        for (const j of json.data.jobs) {
          items.push({ id: j.id, title: j.title, type: "job", slug: j.slug, category: j.department?.name })
        }
      }
      if (json.data?.results) {
        for (const r of json.data.results) {
          items.push({ id: r.id, title: r.title, type: "result", slug: r.slug, category: r.department?.name })
        }
      }
      if (json.data?.admitCards) {
        for (const a of json.data.admitCards) {
          items.push({ id: a.id, title: a.title, type: "admit_card", slug: a.slug, category: a.department?.name })
        }
      }
      setResults(items)
      setSelectedIndex(-1)
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      setError("Failed to perform search. Please try again.")
      setResults([])
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const handleChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => performSearch(value), 150)
  }

  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    for (const r of results) {
      if (!groups[r.type]) groups[r.type] = []
      groups[r.type].push(r)
    }
    return groups
  }, [results])

  const flatResults = React.useMemo(() => results, [results])

  const navigateTo = (result: SearchResult) => {
    onNavigate()
    const base = typeConfig[result.type].href
    router.push(`${base}/${result.slug}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1))
    } else if (e.key === "Enter" && selectedIndex >= 0 && flatResults[selectedIndex]) {
      e.preventDefault()
      navigateTo(flatResults[selectedIndex])
    }
  }

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          placeholder="Search jobs, results, admit cards..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border-0 bg-transparent pl-9 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="max-h-[400px] overflow-y-auto border-t border-gray-200 dark:border-gray-700">
        {loading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-2 py-8 text-gray-500">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && query && Object.keys(groupedResults).length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-gray-500">
            <Search className="h-8 w-8" />
            <p className="text-sm">No results found for &quot;{query}&quot;</p>
            <p className="text-xs">Try different keywords</p>
          </div>
        )}

        {!loading && !error && Object.entries(groupedResults).length > 0 && (
          <div className="py-2">
            {(Object.entries(groupedResults) as [keyof typeof typeConfig, SearchResult[]][]).map(
              ([type, items]) => {
                const config = typeConfig[type]
                const Icon = config.icon
                return (
                  <div key={type}>
                    <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                      <Icon className="h-3.5 w-3.5" />
                      {config.label}
                    </div>
                    {items.map((item) => {
                      const globalIndex = flatResults.indexOf(item)
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigateTo(item)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                            selectedIndex === globalIndex
                              ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          )}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 truncate">
                            <p className="font-medium">{item.title}</p>
                            {item.category && (
                              <p className="text-xs text-gray-500">{item.category}</p>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )
              }
            )}
          </div>
        )}

        {!loading && !error && !query && (
          <div className="flex flex-col items-center gap-2 py-8 text-gray-500">
            <Search className="h-8 w-8" />
            <p className="text-sm">Type to start searching</p>
            <p className="text-xs">
              Press <kbd className="rounded border bg-gray-100 px-1.5 py-0.5 text-xs">↑</kbd>{" "}
              <kbd className="rounded border bg-gray-100 px-1.5 py-0.5 text-xs">↓</kbd> to
              navigate, <kbd className="rounded border bg-gray-100 px-1.5 py-0.5 text-xs">Enter</kbd> to select
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]" key={String(open)}>
        <DialogHeader>
          <DialogTitle className="sr-only">Search</DialogTitle>
        </DialogHeader>
        <SearchContent onNavigate={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function useSearchDialog() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return { open, setOpen }
}
