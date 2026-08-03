"use client"

import { useState } from "react"
import { Share2, MessageCircle, Check, Copy, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`, "_blank", "noopener,noreferrer")
  }

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank", "noopener,noreferrer")
  }

  const shareOnX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, "_blank", "noopener,noreferrer")
  }

  const shareByEmail = () => {
    window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Share2 className="h-4 w-4" /> Share:
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnWhatsApp}
        className="gap-1.5 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-700 dark:hover:bg-green-950"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnLinkedIn}
        className="gap-1.5 border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:hover:bg-blue-950"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnX}
        className="gap-1.5 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareByEmail}
        className="gap-1.5 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-950"
      >
        <Mail className="h-4 w-4" />
        Email
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  )
}