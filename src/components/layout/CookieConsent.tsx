"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("chayan-cookie-consent")
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  function accept() {
    localStorage.setItem("chayan-cookie-consent", "accepted")
    setVisible(false)
  }

  function decline() {
    localStorage.setItem("chayan-cookie-consent", "declined")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            We use cookies to improve your experience, analyze traffic, and show personalized
            content. By continuing, you agree to our{" "}
            <Link href="/cookie-policy" className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400">
              Cookie Policy
            </Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400">
              Privacy Policy
            </Link>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={decline}>
            Decline
          </Button>
          <Button size="sm" onClick={accept}>
            Accept
          </Button>
          <button onClick={decline} className="ml-1 text-gray-400 hover:text-gray-600" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
