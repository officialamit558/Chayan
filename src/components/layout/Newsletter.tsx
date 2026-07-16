"use client"

import * as React from "react"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Newsletter({ className }: { className?: string }) {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [subscribed, setSubscribed] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Subscription failed")
      }

      setSubscribed(true)
      setEmail("")
      toast("Successfully subscribed to newsletter!", "success")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError(message)
      toast(message, "destructive")
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="flex flex-col items-center gap-3 py-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-lg">You&apos;re subscribed!</CardTitle>
          <CardDescription className="text-center">
            Thank you for subscribing. We&apos;ll keep you updated with the latest job notifications.
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-teal-600" />
          <CardTitle className="text-lg">Newsletter</CardTitle>
        </div>
        <CardDescription>
          Get the latest government job alerts delivered to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError("")
              }}
              aria-label="Email address"
              className={cn(error && "border-red-500 focus-visible:ring-red-500")}
            />
            {error && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="shrink-0">
            {loading ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Subscribing
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                Subscribe
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
