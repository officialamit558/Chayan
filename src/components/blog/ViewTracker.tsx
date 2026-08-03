"use client"

import { useEffect } from "react"

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const run = async () => {
      try {
        await fetch(`/api/blog/${slug}/view`, { method: "POST" })
      } catch {
        /* ignore */
      }
    }
    run()
  }, [slug])

  return null
}