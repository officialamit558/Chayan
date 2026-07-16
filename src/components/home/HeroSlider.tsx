"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Briefcase, FileText, Award, TrendingUp, Pause, Play } from "lucide-react"

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
      <span className="text-xs text-teal-200/80">{label}</span>
    </div>
  )
}

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
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

  return (
    <section className="relative h-[520px] overflow-hidden sm:h-[560px] lg:h-[600px]">
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
            quality={100}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-[#0f2744]/70 via-[#1a3a5f]/55 to-[#0f2744]/75" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <h1 className="mb-3 text-center text-4xl font-bold tracking-tight text-white/90 sm:text-5xl lg:text-6xl">
          Your Gateway to{" "}
          <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
            Career Opportunities
          </span>
        </h1>
        <p className="mb-10 max-w-2xl text-center text-base text-white/60 sm:text-lg">
          Find the latest job notifications, exam results, admit cards & updates across government, banking, defence, and more.
        </p>

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
