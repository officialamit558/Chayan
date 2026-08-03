"use client"

import { useState } from "react"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface NewsletterCTAProps {
  topic?: string | null
}

export function NewsletterCTA({ topic }: NewsletterCTAProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!EMAIL_REGEX.test(email.trim())) {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] via-blue-800 to-blue-700 p-6 text-white shadow-lg">
      {subscribed ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <CheckCircle className="h-6 w-6" />
          </div>
          <p className="text-lg font-bold">You&apos;re subscribed!</p>
          <p className="text-sm text-blue-100">New insights landing in your inbox. No spam, ever.</p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Mail className="h-5 w-5 text-amber-300" />
              {topic ? `Get more ${topic} insights` : "Get fresh insights weekly"}
            </h3>
            <p className="mt-1 text-sm text-blue-100">
              Join readers learning careers, AI, money and study skills — one useful email a week.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
            <div className="relative flex-1">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError("") }}
                className="border-white/30 bg-white/10 text-white placeholder:text-blue-200 focus-visible:ring-amber-400"
              />
              {error && (
                <p className="mt-1 flex items-center gap-1 text-xs text-amber-300">
                  <AlertCircle className="h-3 w-3" /> {error}
                </p>
              )}
            </div>
            <Button type="submit" disabled={loading} className="shrink-0 bg-amber-400 font-semibold text-amber-950 hover:bg-amber-300">
              {loading ? "Subscribing…" : <span className="flex items-center gap-1"><Send className="h-4 w-4" /> Subscribe</span>}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}