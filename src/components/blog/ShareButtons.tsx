"use client"

import { Share2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-sm text-gray-500">
        <Share2 className="h-4 w-4" /> Share:
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnWhatsApp}
        className="gap-1.5 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </Button>
    </div>
  )
}
