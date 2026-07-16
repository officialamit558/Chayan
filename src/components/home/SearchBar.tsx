"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <section className="relative -mt-8 z-20 pb-4">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for jobs, results, exams..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-14 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-base shadow-lg focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-14 rounded-xl bg-amber-500 px-8 text-base font-semibold text-gray-900 shadow-lg hover:bg-amber-400"
          >
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </form>
      </div>
    </section>
  )
}
