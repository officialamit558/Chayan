import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatDate, getBaseUrl } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { AdBanner } from "@/components/ads/AdBanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const result = await prisma.result.findUnique({
    where: { slug },
    include: { department: true },
  })

  if (!result) return { title: "Result Not Found" }

  const baseUrl = getBaseUrl()

  return {
    title: result.title,
    description: `${result.title} - ${result.department.name}${result.resultDate ? ` | Result Date: ${formatDate(result.resultDate)}` : ""}${result.description ? ` | ${result.description}` : ""}`,
    alternates: { canonical: `${baseUrl}/result/${result.slug}` },
    twitter: { card: "summary_large_image", title: `${result.title} | Chayan`, description: `${result.department.name} - ${result.resultDate ? `Result: ${formatDate(result.resultDate)}` : ""}` },
  }
}

export default async function ResultDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const result = await prisma.result.findUnique({
    where: { slug },
    include: { department: true, category: true, job: true },
  })

  if (!result) notFound()

  const relatedResults = await prisma.result.findMany({
    where: {
      departmentId: result.departmentId,
      id: { not: result.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { department: true },
  })

  const breadCrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getBaseUrl() },
      { "@type": "ListItem", position: 2, name: "Results", item: `${getBaseUrl()}/results` },
      { "@type": "ListItem", position: 3, name: result.title, item: `${getBaseUrl()}/result/${result.slug}` },
    ],
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: result.title,
    description: result.description || result.title,
    datePublished: result.createdAt,
    publisher: { "@type": "Organization", name: result.department.name },
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadCrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <BreadcrumbNav
        segments={[
          { label: "Results", href: "/results" },
          { label: result.title, href: `/result/${result.slug}` },
        ]}
        className="mb-6"
      />

      <AdBanner format="horizontal" className="mb-8" />

      <Card className="mb-8">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{result.department.name}</Badge>
            {result.category && <Badge>{result.category.name}</Badge>}
          </div>
          <CardTitle className="text-2xl sm:text-3xl">{result.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.description && (
            <div className="whitespace-pre-line text-gray-700">{result.description}</div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {result.resultDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Result Date</p>
                <p className="text-gray-900">{formatDate(result.resultDate)}</p>
              </div>
            )}
            {result.department && (
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="text-gray-900">{result.department.name}</p>
              </div>
            )}
            {result.job && (
              <div>
                <p className="text-sm font-medium text-gray-500">Related Job</p>
                <Link href={`/jobs/${result.job.slug}`} className="text-teal-600 hover:text-teal-700">
                  {result.job.title}
                </Link>
              </div>
            )}
          </div>

          {result.pdfUrl && (
            <Button asChild>
              <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Download Result PDF
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      <AdBanner format="horizontal" />

      {relatedResults.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Related Results</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedResults.map((rr) => (
              <Link key={rr.id} href={`/result/${rr.slug}`}>
                <Card className="h-full border-gray-200 transition-colors hover:border-teal-300 hover:shadow-md">
                  <CardHeader>
                    <Badge variant="secondary" className="mb-2 text-xs w-fit">{rr.department.name}</Badge>
                    <CardTitle className="text-base">{rr.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      {rr.resultDate ? `Result Date: ${formatDate(rr.resultDate)}` : ""}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
