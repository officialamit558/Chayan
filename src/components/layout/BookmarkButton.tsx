"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface BookmarkButtonProps {
  jobId?: string | null
  resultId?: string | null
  admitCardId?: string | null
  size?: "sm" | "icon" | "default"
  variant?: "ghost" | "outline"
  className?: string
}

export function BookmarkButton({
  jobId,
  resultId,
  admitCardId,
  size = "icon",
  variant = "ghost",
  className = "",
}: BookmarkButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!session?.user) {
      setChecking(false)
      return
    }
    const checkBookmark = async () => {
      try {
        const params = new URLSearchParams()
        if (jobId) params.set("jobId", jobId)
        if (resultId) params.set("resultId", resultId)
        if (admitCardId) params.set("admitCardId", admitCardId)
        const res = await fetch(`/api/bookmarks/check?${params}`)
        const json = await res.json()
        setIsBookmarked(json.bookmarked)
      } catch {
      } finally {
        setChecking(false)
      }
    }
    checkBookmark()
  }, [session, jobId, resultId, admitCardId])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      router.push("/login")
      return
    }

    setLoading(true)
    try {
      if (isBookmarked) {
        const params = new URLSearchParams()
        if (jobId) params.set("jobId", jobId)
        if (resultId) params.set("resultId", resultId)
        if (admitCardId) params.set("admitCardId", admitCardId)
        const res = await fetch(`/api/bookmarks/check?${params}`)
        const json = await res.json()
        if (json.id) {
          await fetch(`/api/bookmarks?id=${json.id}`, { method: "DELETE" })
          setIsBookmarked(false)
        }
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, resultId, admitCardId }),
        })
        if (res.ok) setIsBookmarked(true)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  if (checking) return <div className={`h-8 w-8 ${className}`} />

  return (
    <Button
      variant={variant}
      size={size}
      disabled={loading}
      onClick={handleToggle}
      className={className}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4 text-yellow-500" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  )
}
