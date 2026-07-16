import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Complete sitemap of Chayan - Browse all pages, job listings, results, admit cards and more.",
}

export const dynamic = "force-dynamic"

export default async function SitemapPage() {
  const [jobs, results, admitCards, answerKeys, syllabus, admissions, categories] = await Promise.all([
    prisma.job.findMany({ select: { title: true, slug: true }, orderBy: { title: "asc" }, take: 100 }),
    prisma.result.findMany({ select: { title: true, slug: true }, orderBy: { title: "asc" }, take: 100 }),
    prisma.admitCard.findMany({ select: { title: true, slug: true }, orderBy: { title: "asc" }, take: 100 }),
    prisma.answerKey.findMany({ select: { title: true, slug: true }, orderBy: { title: "asc" }, take: 100 }),
    prisma.syllabus.findMany({ select: { title: true, slug: true }, orderBy: { title: "asc" }, take: 100 }),
    prisma.admission.findMany({ select: { title: true, slug: true }, orderBy: { title: "asc" }, take: 100 }),
    prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Sitemap</h1>
      <p className="mb-8 text-gray-600">Browse all pages and listings available on Chayan.</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <Link href="/jobs" className="text-teal-600 hover:text-teal-700">Jobs</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              <li>
                <Link href="/jobs" className="text-sm text-gray-600 hover:text-teal-600">All Jobs</Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-gray-600 hover:text-teal-600">
                    {cat.name} Jobs
                  </Link>
                </li>
              ))}
              <li className="border-t pt-2 mt-2">
                <p className="mb-1 text-xs font-medium text-gray-400">Recent Jobs</p>
              </li>
              {jobs.slice(0, 10).map((job) => (
                <li key={job.slug}>
                  <Link href={`/jobs/${job.slug}`} className="text-sm text-gray-600 hover:text-teal-600 truncate block">
                    {job.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <Link href="/results" className="text-teal-600 hover:text-teal-700">Results</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              <li>
                <Link href="/results" className="text-sm text-gray-600 hover:text-teal-600">All Results</Link>
              </li>
              <li className="border-t pt-2 mt-2">
                <p className="mb-1 text-xs font-medium text-gray-400">Recent Results</p>
              </li>
              {results.slice(0, 10).map((result) => (
                <li key={result.slug}>
                  <Link href={`/result/${result.slug}`} className="text-sm text-gray-600 hover:text-teal-600 truncate block">
                    {result.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <Link href="/admit-cards" className="text-teal-600 hover:text-teal-700">Admit Cards</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              <li>
                <Link href="/admit-cards" className="text-sm text-gray-600 hover:text-teal-600">All Admit Cards</Link>
              </li>
              <li className="border-t pt-2 mt-2">
                <p className="mb-1 text-xs font-medium text-gray-400">Recent Admit Cards</p>
              </li>
              {admitCards.slice(0, 10).map((card) => (
                <li key={card.slug}>
                  <Link href={`/admit-card/${card.slug}`} className="text-sm text-gray-600 hover:text-teal-600 truncate block">
                    {card.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <Link href="/answer-keys" className="text-teal-600 hover:text-teal-700">Answer Keys</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              <li>
                <Link href="/answer-keys" className="text-sm text-gray-600 hover:text-teal-600">All Answer Keys</Link>
              </li>
              <li className="border-t pt-2 mt-2">
                <p className="mb-1 text-xs font-medium text-gray-400">Recent Answer Keys</p>
              </li>
              {answerKeys.slice(0, 10).map((key) => (
                <li key={key.slug}>
                  <Link href={`/answer-key/${key.slug}`} className="text-sm text-gray-600 hover:text-teal-600 truncate block">
                    {key.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <Link href="/syllabus" className="text-teal-600 hover:text-teal-700">Syllabus</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              <li>
                <Link href="/syllabus" className="text-sm text-gray-600 hover:text-teal-600">All Syllabus</Link>
              </li>
              <li className="border-t pt-2 mt-2">
                <p className="mb-1 text-xs font-medium text-gray-400">Recent Syllabus</p>
              </li>
              {syllabus.slice(0, 10).map((s) => (
                <li key={s.slug}>
                  <Link href={`/syllabus/${s.slug}`} className="text-sm text-gray-600 hover:text-teal-600 truncate block">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <Link href="/admissions" className="text-teal-600 hover:text-teal-700">Admissions</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              <li>
                <Link href="/admissions" className="text-sm text-gray-600 hover:text-teal-600">All Admissions</Link>
              </li>
              <li className="border-t pt-2 mt-2">
                <p className="mb-1 text-xs font-medium text-gray-400">Recent Admissions</p>
              </li>
              {admissions.slice(0, 10).map((admission) => (
                <li key={admission.slug}>
                  <Link href={`/admission/${admission.slug}`} className="text-sm text-gray-600 hover:text-teal-600 truncate block">
                    {admission.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
