"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Briefcase, FileText, Award, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CounterProps {
  end: number
  suffix?: string
  duration?: number
  label: string
  icon: React.ReactNode
}

function CountUp({ end, suffix = "", duration = 2, label, icon }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasStarted) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [hasStarted, end, duration])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
        {icon}
      </div>
      <span className="text-2xl font-bold text-white">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-sm text-teal-100">{label}</span>
    </div>
  )
}

const stats = [
  { end: 125000, suffix: "+", label: "Total Jobs", icon: <Briefcase className="h-5 w-5 text-white" /> },
  { end: 15000, suffix: "+", label: "Active Notifications", icon: <FileText className="h-5 w-5 text-white" /> },
  { end: 8500, suffix: "+", label: "Results Published", icon: <Award className="h-5 w-5 text-white" /> },
  { end: 3200, suffix: "+", label: "Exams Conducted", icon: <TrendingUp className="h-5 w-5 text-white" /> },
]

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div>
            <h1 className="mb-4 animate-fade-in-up text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Gateway to{" "}
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Government Jobs
              </span>{" "}
              in India
            </h1>
            <p className="mx-auto mb-8 max-w-2xl animate-fade-in-up text-lg text-teal-100 sm:text-xl" style={{ animationDelay: "0.1s" }}>
              Find the latest government job notifications, exam results, admit cards, and more. 
              Your one-stop destination for Sarkari Naukri updates.
            </p>
          </div>

          <div className="mx-auto mb-12 max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for jobs, results, exams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 w-full border-0 bg-white pl-12 pr-4 text-base shadow-lg ring-1 ring-white/20 focus-visible:ring-2 focus-visible:ring-yellow-400"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 bg-yellow-500 px-8 text-base font-semibold text-gray-900 hover:bg-yellow-400"
              >
                Search
              </Button>
            </form>
          </div>

          <div className="mb-10 grid animate-fade-in-up grid-cols-2 gap-6 sm:grid-cols-4" style={{ animationDelay: "0.3s" }}>
            {stats.map((stat) => (
              <CountUp key={stat.label} {...stat} />
            ))}
          </div>

          <div className="flex animate-fade-in-up items-center justify-center gap-2 text-teal-200" style={{ animationDelay: "0.4s" }}>
            <Users className="h-4 w-4" />
            <span className="text-sm">
              Trusted by millions of job seekers across India
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
