"use client"

import Link from "next/link"
import { Calendar, MapPin, IndianRupee, Briefcase, ExternalLink, ArrowLeft, Mail, Building2 } from "lucide-react"
import { BookmarkButton } from "@/components/layout/BookmarkButton"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Company {
  id: string; name: string; logo?: string | null; website?: string | null; description?: string | null
}

interface PrivateJob {
  id: string; title: string; slug: string; type: string; category?: string | null
  description?: string | null; location?: string | null; salary?: string | null
  experience?: string | null; applicationUrl?: string | null
  applicationEmail?: string | null; lastDate?: string | null; status: string
  company: Company; createdAt: string
}

const typeLabels: Record<string, string> = {
  FULL_TIME: "Full-Time", PART_TIME: "Part-Time", INTERNSHIP: "Internship", CONTRACT: "Contract",
}

export function PrivateJobDetail({ job }: { job: PrivateJob }) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link href="/private-jobs" className="mb-6 inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700">
        <ArrowLeft className="h-4 w-4" /> Back to Private Jobs
      </Link>

      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-sm">{typeLabels[job.type]}</Badge>
          {job.category && <Badge variant="secondary" className="text-sm">{job.category}</Badge>}
          <Badge variant={job.status === "ACTIVE" ? "default" : "secondary"}>
            {job.status === "ACTIVE" ? "Active" : "Expired"}
          </Badge>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{job.title}</h1>
        <div className="flex items-center gap-2 text-lg text-teal-700">
          <Building2 className="h-5 w-5" />
          <span className="font-semibold">{job.company.name}</span>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-6 text-sm text-gray-600">
        {job.location && (
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gray-400" />{job.location}</span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-gray-400" />{job.salary}</span>
        )}
        {job.experience && (
          <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-gray-400" />{job.experience}</span>
        )}
        {job.lastDate && (
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-gray-400" />Last Date: {formatDate(job.lastDate)}</span>
        )}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <BookmarkButton privateJobId={job.id} />
        {job.applicationUrl && (
          <Button asChild>
            <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Apply Now
            </a>
          </Button>
        )}
        {job.applicationEmail && (
          <Button variant="outline" asChild>
            <a href={`mailto:${job.applicationEmail}`}>
              <Mail className="mr-2 h-4 w-4" /> Apply via Email
            </a>
          </Button>
        )}
      </div>

      {job.description && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Job Description</h2>
            <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
          </CardContent>
        </Card>
      )}

      {job.company.description && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">About {job.company.name}</h2>
            <p className="text-gray-600">{job.company.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}