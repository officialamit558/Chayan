"use client"

import { FileText, ExternalLink, Share2, Check, Copy, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { formatDate, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface ImportantDate {
  label: string
  date: string
}

interface JobDetailContentProps {
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
  slug,
}: JobDetailContentProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/apply/${slug}` : ""
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

  const dates: ImportantDate[] = importantDates
    ? Object.entries(importantDates).map(([label, date]) => ({ label, date }))
    : []

  const detailItems = [
    { label: "Advertisement No", value: advertisementNo },
    { label: "Total Vacancies", value: totalVacancies?.toString() },
    { label: "Salary", value: salary },
    { label: "Location", value: location },
    { label: "Age Limit", value: ageLimit },
    { label: "Age Relaxation", value: ageRelaxation },
    { label: "Education", value: education },
    { label: "Experience", value: experience },
    { label: "Application Fee", value: applicationFee },
    { label: "Start Date", value: startDate ? formatDate(startDate) : null },
    { label: "Last Date", value: lastDate ? formatDate(lastDate) : null },
  ].filter((item) => item.value)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
          <p className="mt-1 text-gray-600">{department}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {officialNotification && (
            <Button variant="outline" asChild>
              <a href={officialNotification} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Notification
              </a>
            </Button>
          )}
          <Button asChild>
            <a href={applyLink || officialWebsite || "#"} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Apply Now
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Share:</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyLink}>
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter/X">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {detailItems.map((item) => (
                <TableRow key={item.label}>
                  <TableCell className="w-48 font-medium text-gray-700">{item.label}</TableCell>
                  <TableCell>{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {dates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Important Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {dates.map((date) => (
                  <TableRow key={date.label}>
                    <TableCell className="w-48 font-medium text-gray-700">{date.label}</TableCell>
                    <TableCell>{date.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectionProcess && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selection Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-gray-700">{selectionProcess}</div>
          </CardContent>
        </Card>
      )}

      {applicationFee && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-gray-700">{applicationFee}</div>
          </CardContent>
        </Card>
      )}

      {education && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Education Qualification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-gray-700">{education}</div>
          </CardContent>
        </Card>
      )}

      {documentsRequired && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documents Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-gray-700">{documentsRequired}</div>
          </CardContent>
        </Card>
      )}

      {howToApply && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How to Apply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-gray-700">{howToApply}</div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-4 pt-4">
        {officialNotification && (
          <Button variant="outline" size="lg" asChild>
            <a href={officialNotification} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-5 w-5" />
              Download Official Notification
            </a>
          </Button>
        )}
        <Button size="lg" asChild>
          <a href={applyLink || officialWebsite || "#"} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-5 w-5" />
            Apply Online
          </a>
        </Button>
      </div>
    </div>
  )
}
