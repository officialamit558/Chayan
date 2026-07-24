"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Briefcase, TrendingUp, Target, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ResumeUpload } from "@/components/profile/ResumeUpload"

interface Company { id: string; name: string; logo: string | null }
interface RecommendedJob {
  id: string; title: string; slug: string; type: string; category: string | null
  location: string | null; salary: string | null; experience: string | null
  company: Company; matchScore: number; matchedSkills: string[]
  matchDetails: string[]; improvementTips: string[]
}

export function JobRecommendations() {
  const [recs, setRecs] = useState<{ topMatches: RecommendedJob[]; otherJobs: RecommendedJob[]; matchCount: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasResume, setHasResume] = useState(false)
  const [message, setMessage] = useState("")

  const fetchRecs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/private-jobs/recommendations")
      const json = await res.json()
      if (json.success) {
        if (json.data.length === 0 && json.message) {
          setMessage(json.message)
          setHasResume(false)
        } else {
          setRecs(json.data)
          setHasResume(true)
          setMessage("")
        }
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRecs() }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!hasResume) {
    return (
      <Card className="border-2 border-dashed border-teal-200 bg-teal-50/50">
        <CardContent className="py-8">
          <div className="flex flex-col items-center text-center">
            <Target className="mb-3 h-10 w-10 text-teal-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Personalized Job Recommendations</h3>
            <p className="mb-6 max-w-md text-sm text-gray-600">
              Upload your resume and our AI-powered system will analyze your skills, experience, and education to
              recommend the best matching private jobs for you.
            </p>
            <div className="w-full max-w-md">
              <ResumeUpload onResumeChange={fetchRecs} />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!recs || recs.topMatches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <TrendingUp className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <h3 className="mb-1 text-lg font-semibold text-gray-900">No Matching Jobs Yet</h3>
          <p className="mb-4 text-sm text-gray-500">
            We couldn&apos;t find jobs matching your profile. Check back later or update your resume.
          </p>
          <ResumeUpload onResumeChange={fetchRecs} />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Recommended for You
            <span className="ml-2 text-sm font-normal text-gray-500">({recs.matchCount} matches)</span>
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchRecs}>
          <RefreshCw className="mr-1 h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recs.topMatches.slice(0, 6).map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/private-jobs/${job.slug}`}>
              <Card className="group h-full cursor-pointer border-teal-100 transition-all hover:border-teal-300 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-teal-600 text-white">
                          {job.matchScore}% Match
                        </Badge>
                        <Badge variant="outline" className="text-xs">{job.type}</Badge>
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-gray-900 group-hover:text-teal-700">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">{job.company.name}</p>
                    </div>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {job.matchedSkills.slice(0, 4).map(s => (
                      <Badge key={s} variant="secondary" className="bg-teal-50 text-xs text-teal-700">
                        {s}
                      </Badge>
                    ))}
                    {job.matchedSkills.length > 4 && (
                      <Badge variant="outline" className="text-xs">+{job.matchedSkills.length - 4}</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    {job.location && <span>{job.location}</span>}
                    {job.experience && <span>{job.experience}</span>}
                    {job.salary && <span className="text-teal-600">{job.salary}</span>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {recs.otherJobs.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-500 hover:text-teal-600">
            Show other {recs.otherJobs.length} available jobs
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {recs.otherJobs.slice(0, 4).map((job, i) => (
              <Link key={job.id} href={`/private-jobs/${job.slug}`}>
                <Card className="group h-full cursor-pointer transition-all hover:border-gray-300 hover:shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{job.matchScore}%</Badge>
                          <Badge variant="outline" className="text-xs">{job.type}</Badge>
                        </div>
                        <h3 className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-teal-700">
                          {job.title}
                        </h3>
                        <p className="text-xs text-gray-600">{job.company.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}