"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, Briefcase, FileText, Award, TrendingUp, Users, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const slides = [
  { src: "/11.jpg" },
  { src: "/12.jpg" },
  { src: "/13.jpg" },
  { src: "/14.jpg" },
  { src: "/15.webp" },
  { src: "/16.jpg" },
  { src: "/17.webp" },
  { src: "/18.avif" },
]

interface CounterProps {
  end: number
  suffix?: string
  label: string
  icon: React.ReactNode
}

function CountUp({ end, suffix = "", label, icon }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasStarted) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setHasStarted(true); observer.disconnect() }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / 2000, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [hasStarted, end])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">{icon}</div>
      <span className="text-2xl font-bold text-white">{count.toLocaleString()}{suffix}</span>
      <span className="text-xs text-blue-200/80">{label}</span>
    </div>
  )
}

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPaused, setIsPaused] = useState(false)
  const [stats, setStats] = useState<{ end: number; suffix: string; label: string; icon: React.ReactNode }[] | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setStats([
            { end: d.data.totalJobs || 0, suffix: "+", label: "Total Jobs", icon: <Briefcase className="h-5 w-5 text-white" /> },
            { end: d.data.activeJobs || 0, suffix: "+", label: "Active Notifications", icon: <FileText className="h-5 w-5 text-white" /> },
            { end: d.data.totalResults || 0, suffix: "+", label: "Results Published", icon: <Award className="h-5 w-5 text-white" /> },
            { end: d.data.totalAdmitCards || 0, suffix: "+", label: "Admit Cards", icon: <TrendingUp className="h-5 w-5 text-white" /> },
          ])
        }
      })
      .catch(() => {})
  }, [])

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [])

  useEffect(() => {
    if (isPaused) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(next, 5000)
    return () => clearInterval(intervalRef.current)
  }, [isPaused, next])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) window.location.href = `/jobs?search=${encodeURIComponent(searchQuery.trim())}`
  }

  return (
    <section className="relative h-[600px] overflow-hidden sm:h-[650px] lg:h-[700px]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={slide.src}
            alt={`Slide ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-[#0f2744]/85 via-[#1a3a5f]/70 to-[#0f2744]/90" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(34,197,94,0.08),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-blue-200 backdrop-blur-md">
          <Users className="h-3.5 w-3.5" />
          Trusted by millions of job seekers across India
        </div>

        <h1 className="mb-3 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Your Gateway to{" "}
          <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
            Government Jobs
          </span>
        </h1>
        <p className="mb-8 max-w-2xl text-center text-base text-blue-200/90 sm:text-lg">
          Find the latest government job notifications, exam results, admit cards & more.
          Your one-stop destination for Sarkari Naukri updates.
        </p>

        <div className="mb-10 w-full max-w-2xl">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for jobs, results, exams..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-14 w-full border-0 bg-white/95 pl-12 pr-4 text-base shadow-xl backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 bg-amber-500 px-8 text-base font-semibold text-gray-900 hover:bg-amber-400">
              Search
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats ? stats.map(s => <CountUp key={s.label} {...s} />) : (
            <>
              {[{ end: 0, label: "Total Jobs" }, { end: 0, label: "Notifications" }, { end: 0, label: "Results" }, { end: 0, label: "Admit Cards" }].map(s => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <div className="h-10 w-10 rounded-full bg-white/10" />
                  <div className="h-7 w-20 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-all hover:bg-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-all hover:bg-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        <button
          onClick={() => setIsPaused(p => !p)}
          className="rounded-full bg-white/10 p-1.5 text-white/70 backdrop-blur-md hover:bg-white/20 hover:text-white"
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "h-2.5 w-8 bg-amber-400" : "h-2.5 w-2.5 bg-white/40 hover:bg-white/60"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
