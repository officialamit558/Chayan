"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface AdBannerProps {
  slot?: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  className?: string
}

export function AdBanner({ slot = "1234567890", format = "auto", className }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const adsbygoogle = (window as any).adsbygoogle || []
      adsbygoogle.push({})
    } catch {
      /* AdSense not loaded yet */
    }
  }, [])

  const sizeClasses: Record<string, string> = {
    auto: "min-h-[90px] md:min-h-[250px]",
    rectangle: "min-h-[250px] md:min-h-[250px]",
    horizontal: "min-h-[90px] md:min-h-[90px]",
    vertical: "min-h-[250px] md:min-h-[600px]",
  }

  return (
    <div className={cn("my-6", className)}>
      <p className="mb-1 text-center text-xs text-gray-400">Advertisement</p>
      <div
        ref={adRef}
        className={cn(
          "flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50",
          sizeClasses[format] || sizeClasses.auto,
        )}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}
