"use client"

import { useState, useEffect, useRef } from "react"
import { ListTree, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Heading {
  level: 2 | 3
  text: string
}

export function TableOfContents({ className }: { className?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string>("")
  const [collapsed, setCollapsed] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const article = document.querySelector("article")
    if (!article) return

    const items: Heading[] = []
    article.querySelectorAll("h2, h3").forEach((h) => {
      const text = h.textContent?.trim()
      if (!text || text.length > 90) return
      items.push({ level: h.tagName === "H3" ? 3 : 2, text })
    })
    setHeadings(items)
    if (items.length < 2) return

    const els = Array.from(article.querySelectorAll("h2, h3")).filter(
      (h) => h.textContent?.trim() && h.textContent!.trim().length <= 90
    )

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.textContent?.trim() || "")
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    )
    els.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  if (headings.length < 2) return null

  const scrollTo = (text: string) => {
    const el = Array.from(document.querySelectorAll("article h2, article h3")).find(
      (h) => h.textContent?.trim() === text
    )
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <nav className={cn("rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800", className)}>
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100"
      >
        <span className="flex items-center gap-2">
          <ListTree className="h-4 w-4 text-blue-600" /> On this page
        </span>
        {collapsed ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronUp className="h-4 w-4 text-gray-400" />}
      </button>
      {!collapsed && (
        <ul className="space-y-1 border-t border-gray-100 px-3 py-3 dark:border-gray-700">
          {headings.map((h) => (
            <li key={h.text} style={{ paddingLeft: h.level === 3 ? "1rem" : "0" }}>
              <button
                type="button"
                onClick={() => scrollTo(h.text)}
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                  active === h.text
                    ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
                )}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}