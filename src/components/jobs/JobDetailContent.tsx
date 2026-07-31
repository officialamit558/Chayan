"use client"

import {
  FileText, ExternalLink, Check, Copy, Printer,
  Calendar, CalendarClock, CalendarPlus, Users, IndianRupee, MapPin,
  GraduationCap, Briefcase, Wallet, Hash, AlarmClock, ShieldCheck,
  ListChecks, ClipboardList, UserRound, Clock,
} from "lucide-react"
import { useState, useEffect } from "react"
import { formatDate, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { BookmarkButton } from "@/components/layout/BookmarkButton"

interface JobDetailContentProps {
  jobId: string
  title: string
  department: string
  departmentId: string
  advertisementNo: string | null
  totalVacancies: number | null
  salary: string | null
  location: string | null
  ageLimit: string | null
  ageRelaxation: string | null
  education: string | null
  selectionProcess: string | null
  applicationFee: string | null
  importantDates: Record<string, string> | null
  documentsRequired: string | null
  howToApply: string | null
  officialNotification: string | null
  officialWebsite: string | null
  applyLink: string | null
  experience: string | null
  startDate: string | null
  lastDate: string | null
  slug: string
}

export function JobDetailContent({
  jobId,
  title,
  department,
  advertisementNo,
  totalVacancies,
  salary,
  location,
  ageLimit,
  ageRelaxation,
  education,
  selectionProcess,
  applicationFee,
  importantDates,
  documentsRequired,
  howToApply,
  officialNotification,
  officialWebsite,
  applyLink,
  experience,
  startDate,
  lastDate,
}: JobDetailContentProps) {
  const [copied, setCopied] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(timer)
  }, [])

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} ${shareUrl}`)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
    }
  }

  const dates: { label: string; date: string }[] = importantDates
    ? Object.entries(importantDates).map(([label, date]) => ({ label, date }))
    : []

  const lastDateMs = lastDate ? new Date(lastDate).getTime() : null
  const diff = lastDateMs ? lastDateMs - now : null
  const daysLeft = diff !== null ? Math.floor(diff / 86400000) : null
  const hoursLeft = diff !== null ? Math.floor((diff % 86400000) / 3600000) : null
  const minsLeft = diff !== null ? Math.floor((diff % 3600000) / 60000) : null
  const isUrgent = diff !== null && diff > 0 && diff <= 7 * 86400000
  const isClosed = diff !== null && diff <= 0

  const stats = [
    { icon: Users, label: "Total Vacancies", value: totalVacancies ? totalVacancies.toLocaleString("en-IN") : null, highlight: true },
    { icon: IndianRupee, label: "Salary / Pay Scale", value: salary },
    { icon: CalendarClock, label: "Last Date", value: lastDate ? formatDate(lastDate) : null, urgent: isUrgent || undefined },
    { icon: MapPin, label: "Location", value: location },
  ].filter((s) => s.value)

  const stepify = (text: string): string[] => text.split("\n").map((s) => s.trim()).filter(Boolean)

  const details: { icon: typeof Hash; label: string; value: string | null }[] = [
    { icon: Hash, label: "Advertisement No", value: advertisementNo },
    { icon: Users, label: "Total Vacancies", value: totalVacancies ? totalVacancies.toLocaleString("en-IN") : null },
    { icon: IndianRupee, label: "Salary / Pay Scale", value: salary },
    { icon: MapPin, label: "Location", value: location },
    { icon: UserRound, label: "Age Limit", value: ageLimit },
    { icon: UserRound, label: "Age Relaxation", value: ageRelaxation },
    { icon: GraduationCap, label: "Education Qualification", value: education },
    { icon: Briefcase, label: "Experience", value: experience },
    { icon: Wallet, label: "Application Fee", value: applicationFee },
    { icon: CalendarPlus, label: "Application Begin", value: startDate ? formatDate(startDate) : null },
    { icon: CalendarClock, label: "Last Date to Apply", value: lastDate ? formatDate(lastDate) : null },
  ].filter((item) => item.value)

  const sections = [
    { id: "job-details", label: "Vacancy Details", icon: ClipboardList, show: details.length > 0 },
    { id: "important-dates", label: "Important Dates", icon: Calendar, show: dates.length > 0 },
    {
      id: "eligibility", label: "Eligibility", icon: GraduationCap,
      show: Boolean(education || ageLimit || experience || selectionProcess),
    },
    { id: "fees", label: "Application Fees", icon: Wallet, show: Boolean(applicationFee) },
    { id: "documents", label: "Documents", icon: ListChecks, show: Boolean(documentsRequired) },
    { id: "how-to-apply", label: "How to Apply", icon: FileText, show: Boolean(howToApply) },
  ].filter((s) => s.show)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="space-y-6 [scroll-behavior:smooth]">
      {/* ── Header / Hero ─────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] via-blue-800 to-blue-700 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-amber-400/10 blur-2xl" />

        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {advertisementNo && (
              <Badge className="bg-white/15 text-white backdrop-blur">Advt No: {advertisementNo}</Badge>
            )}
            {isUrgent && (
              <Badge className="bg-amber-400 text-amber-950">
                <AlarmClock className="mr-1 h-3 w-3" /> Closing Soon
              </Badge>
            )}
            {isClosed && (
              <Badge className="bg-red-500 text-white">
                <Clock className="mr-1 h-3 w-3" /> Closed
              </Badge>
            )}
            {totalVacancies ? (
              <Badge className="bg-white/15 text-white backdrop-blur">{totalVacancies.toLocaleString("en-IN")} Vacancies</Badge>
            ) : null}
          </div>

          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 flex items-center gap-2 text-blue-100">
            <span className="font-medium text-white">{department}</span>
            {location && (
              <>
                <span className="text-blue-300">•</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{location}</span>
              </>
            )}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button size="sm" className="bg-amber-400 font-semibold text-amber-950 hover:bg-amber-300" asChild>
              <a href={applyLink || officialWebsite || "#"} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-4 w-4" /> Apply Now
              </a>
            </Button>
            <BookmarkButton jobId={jobId} size="default" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" />
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/15" onClick={() => window.print()} title="Print">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Live Countdown ────────────────────────────── */}
      {lastDateMs && !isClosed && (
        <div className={cn(
          "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border p-4",
          isUrgent ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50" : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50",
        )}>
          <span className={cn(
            "flex items-center gap-2 text-sm font-semibold",
            isUrgent ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400",
          )}>
            <AlarmClock className="h-5 w-5" /> Time Left to Apply
          </span>
          <div className="flex items-center gap-2">
            {[
              { value: daysLeft, unit: "Days" },
              { value: hoursLeft, unit: "Hrs" },
              { value: minsLeft, unit: "Min" },
            ].map((t) => (
              <div key={t.unit} className={cn(
                "rounded-lg px-3 py-1.5 text-center",
                isUrgent ? "bg-red-100 dark:bg-red-900" : "bg-blue-100 dark:bg-blue-900",
              )}>
                <div className={cn("text-lg font-bold leading-none", isUrgent ? "text-red-700 dark:text-red-400" : "text-blue-800 dark:text-blue-300")}>
                  {t.value !== null ? t.value : 0}
                </div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{t.unit}</div>
              </div>
            ))}
          </div>
          <p className="ml-auto text-sm text-gray-600 dark:text-gray-400">
            Final date: <span className="font-semibold">{formatDate(lastDate!)}</span>
          </p>
        </div>
      )}

      {/* ── Quick Stats ───────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={cn(
            "rounded-xl border p-4",
            s.urgent ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40" : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
          )}>
            <div className={cn(
              "mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide",
              s.urgent ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400",
            )}>
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </div>
            <div className={cn(
              "text-sm font-bold",
              s.urgent ? "text-red-700 dark:text-red-300" : "text-gray-900 dark:text-gray-100",
            )}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Navigation ──────────────────────────── */}
      {sections.length > 1 && (
        <nav className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300"
            >
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </button>
          ))}
        </nav>
      )}

      {/* ── Share ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Share this job:</span>
        <Button variant="outline" size="sm" onClick={copyLink}>
          {copied ? <Check className="mr-1 h-4 w-4 text-green-500" /> : <Copy className="mr-1 h-4 w-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </Button>
      </div>

      {/* ── Job Details Table ─────────────────────────── */}
      {details.length > 0 && (
        <section id="job-details" className="scroll-mt-24">
          <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b bg-gray-50 dark:bg-gray-800/60">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5 text-blue-600" /> Vacancy Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {details.map((item, i) => (
                    <TableRow key={item.label} className={cn(i % 2 === 1 && "bg-gray-50/70 dark:bg-gray-800/40")}>
                      <TableCell className="w-56 font-medium text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 shrink-0 text-blue-500" /> {item.label}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-pre-line">{item.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── Important Dates ───────────────────────────── */}
      {dates.length > 0 && (
        <section id="important-dates" className="scroll-mt-24">
          <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b bg-gray-50 dark:bg-gray-800/60">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" /> Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {dates.map((d, i) => {
                    const isKeyDate = /begin|start|last|clos/i.test(d.label)
                    return (
                      <TableRow key={d.label} className={cn(i % 2 === 1 && "bg-gray-50/70 dark:bg-gray-800/40")}>
                        <TableCell className="w-10 text-center">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {i + 1}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium text-gray-700 dark:text-gray-300">{d.label}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={isKeyDate ? "default" : "outline"} className={cn(!isKeyDate && "bg-white dark:bg-gray-800")}>
                            {d.date}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── Eligibility ───────────────────────────────── */}
      {(education || ageLimit || experience || selectionProcess) && (
        <section id="eligibility" className="scroll-mt-24">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b bg-gray-50 dark:bg-gray-800/60">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" /> Eligibility Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {education && (
                  <Badge variant="secondary" className="bg-blue-50 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    <GraduationCap className="mr-1 h-3 w-3" /> {education}
                  </Badge>
                )}
                {ageLimit && (
                  <Badge variant="secondary" className="bg-green-50 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                    <UserRound className="mr-1 h-3 w-3" /> Age: {ageLimit}
                  </Badge>
                )}
                {experience && (
                  <Badge variant="secondary" className="bg-purple-50 text-xs text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    <Briefcase className="mr-1 h-3 w-3" /> {experience}
                  </Badge>
                )}
              </div>
              {ageRelaxation && (
                <div>
                  <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Age Relaxation</p>
                  <div className="whitespace-pre-line text-sm text-gray-600 dark:text-gray-400">{ageRelaxation}</div>
                </div>
              )}
              {selectionProcess && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Selection Process</p>
                  {stepify(selectionProcess).length > 1 ? (
                    <ol className="space-y-2">
                      {stepify(selectionProcess).map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="whitespace-pre-line text-sm text-gray-600 dark:text-gray-400">{selectionProcess}</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── Application Fees ──────────────────────────── */}
      {applicationFee && (
        <section id="fees" className="scroll-mt-24">
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-amber-800 dark:text-amber-300">
                <Wallet className="h-5 w-5 text-amber-600" /> Application Fee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">{applicationFee}</div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── Documents Required ────────────────────────── */}
      {documentsRequired && (
        <section id="documents" className="scroll-mt-24">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b bg-gray-50 dark:bg-gray-800/60">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5 text-blue-600" /> Documents Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stepify(documentsRequired).length > 1 ? (
                <ul className="space-y-2">
                  {stepify(documentsRequired).map((doc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" /> {doc}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">{documentsRequired}</div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── How to Apply ──────────────────────────────── */}
      {howToApply && (
        <section id="how-to-apply" className="scroll-mt-24">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b bg-gray-50 dark:bg-gray-800/60">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-600" /> How to Apply
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stepify(howToApply).length > 1 ? (
                <ol className="space-y-3">
                  {stepify(howToApply).map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="whitespace-pre-line">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">{howToApply}</div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── Trust / Verify Note ───────────────────────── */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p className="font-semibold text-amber-800 dark:text-amber-300">Important Note</p>
          <p className="mt-0.5">
            This is not a government website. Always verify all details (fees, dates, eligibility) from the{" "}
            <a href={officialWebsite || "#"} target="_blank" rel="noopener noreferrer" className="font-medium text-amber-700 underline dark:text-amber-400">
              official notification
            </a>{" "}
            before applying. We recommend applying only through the official website.
          </p>
        </div>
      </div>

      {/* ── Bottom Actions ────────────────────────────── */}
      <div className="flex flex-wrap gap-3 pt-2">
        {officialNotification && (
          <Button variant="outline" size="lg" asChild>
            <a href={officialNotification} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-5 w-5" /> Download Official Notification
            </a>
          </Button>
        )}
        <Button size="lg" className="bg-amber-400 font-semibold text-amber-950 hover:bg-amber-300" asChild>
          <a href={applyLink || officialWebsite || "#"} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-5 w-5" /> Apply Online
          </a>
        </Button>
      </div>

      {/* ── Sticky Mobile Apply Bar ───────────────────── */}
      <div className="sticky bottom-0 z-40 -mx-4 mt-4 border-t bg-white/95 px-4 py-3 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
            <p className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isClosed ? "text-red-600" : isUrgent ? "text-red-500" : "text-green-600",
            )}>
              {isClosed ? <Clock className="h-3 w-3" /> : <AlarmClock className="h-3 w-3" />}
              {isClosed
                ? "Applications closed"
                : daysLeft !== null
                  ? `${daysLeft} days left to apply`
                  : "Applications open"}
            </p>
          </div>
          <Button className="bg-amber-400 font-semibold text-amber-950 hover:bg-amber-300" asChild>
            <a href={applyLink || officialWebsite || "#"} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-4 w-4" /> Apply Now
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
