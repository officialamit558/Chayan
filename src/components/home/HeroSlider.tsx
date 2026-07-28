"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Briefcase, FileText, Award, TrendingUp, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

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
  delay?: number
}

function CountUp({ end, suffix = "", label, icon, delay = 0 }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasStarted) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setHasStarted(true); observer.disconnect() }
    }, { threshold: 0.3 })
    setTimeout(() => observer.observe(el), delay)
    return () => observer.disconnect()
  }, [hasStarted, delay])

  useEffect(() => {
    if (!hasStarted) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / 2200, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [hasStarted, end])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
        {icon}
      </div>
      <span className="text-xl font-bold text-white tabular-nums sm:text-2xl">{count.toLocaleString()}{suffix}</span>
      <span className="text-[11px] text-white/50 uppercase tracking-wider">{label}</span>
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
            { end: d.data.totalJobs || 0, suffix: "+", label: "Active Jobs", icon: <Briefcase className="h-4 w-4 text-white" /> },
            { end: d.data.activeJobs || 0, suffix: "+", label: "Notifications", icon: <FileText className="h-4 w-4 text-white" /> },
            { end: d.data.totalResults || 0, suffix: "+", label: "Results", icon: <Award className="h-4 w-4 text-white" /> },
            { end: d.data.totalAdmitCards || 0, suffix: "+", label: "Admit Cards", icon: <TrendingUp className="h-4 w-4 text-white" /> },
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
    <section className="relative h-[500px] overflow-hidden sm:h-[540px] lg:h-[580px]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-all duration-1000",
            i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
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

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/85 via-[#0f2744]/65 to-[#0a1628]/70" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(10,22,40,0.4)_100%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs text-white/60 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Trusted by job seekers across India
        </div>

        <h1 className="mb-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Your Trusted Source for
          <br />
          <span className="text-amber-400">Government Job Updates</span>
        </h1>
        <p className="mb-10 max-w-xl text-center text-sm text-white/50 sm:text-base">
          Latest job notifications, exam results, admit cards & answer keys from central and state governments
        </p>

        <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-4">
          {stats ? stats.map((s, i) => <CountUp key={s.label} {...s} delay={i * 100} />) : (
            <>
              {[{ end: 0, label: "Active Jobs" }, { end: 0, label: "Notifications" }, { end: 0, label: "Results" }, { end: 0, label: "Admit Cards" }].map(s => (
                <div key={s.label} className="flex flex-col items-center gap-1.5">
                  <div className="h-9 w-9 rounded-full bg-white/5" />
                  <div className="h-6 w-16 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/5 p-1.5 text-white/60 backdrop-blur-md transition-all hover:bg-white/15 hover:text-white border border-white/10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/5 p-1.5 text-white/60 backdrop-blur-md transition-all hover:bg-white/15 hover:text-white border border-white/10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        <button
          onClick={() => setIsPaused(p => !p)}
          className="rounded-full bg-white/5 p-1 text-white/40 backdrop-blur-md hover:bg-white/15 hover:text-white border border-white/10"
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
        </button>
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current ? "h-2 w-6 bg-amber-400" : "h-2 w-2 bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
