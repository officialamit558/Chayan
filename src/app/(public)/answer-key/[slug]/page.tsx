import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatDate, getBaseUrl } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const answerKey = await prisma.answerKey.findUnique({
    where: { slug },
    include: { department: true },
  })

  if (!answerKey) return { title: "Answer Key Not Found" }

  const baseUrl = getBaseUrl()

  return {
    title: answerKey.title,
    description: `${answerKey.title} - ${answerKey.department.name}${answerKey.description ? ` | ${answerKey.description}` : ""}`,
    alternates: { canonical: `${baseUrl}/answer-key/${answerKey.slug}` },
    twitter: { card: "summary_large_image", title: `${answerKey.title} | Chayan`, description: `${answerKey.department.name} - Download answer key` },
  }
}

export default async function AnswerKeyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const answerKey = await prisma.answerKey.findUnique({
    where: { slug },
    include: { department: true, category: true, job: true },
  })

  if (!answerKey) notFound()

  const relatedKeys = await prisma.answerKey.findMany({
    where: {
      departmentId: answerKey.departmentId,
      id: { not: answerKey.id },
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
      { "@type": "ListItem", position: 2, name: "Answer Keys", item: `${getBaseUrl()}/answer-keys` },
      { "@type": "ListItem", position: 3, name: answerKey.title, item: `${getBaseUrl()}/answer-key/${answerKey.slug}` },
    ],
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadCrumbLd) }} />
      <BreadcrumbNav
        segments={[
          { label: "Answer Keys", href: "/answer-keys" },
          { label: answerKey.title, href: `/answer-key/${answerKey.slug}` },
        ]}
        className="mb-6"
      />

      <Card className="mb-8">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{answerKey.department.name}</Badge>
            {answerKey.category && <Badge>{answerKey.category.name}</Badge>}
          </div>
          <CardTitle className="text-2xl sm:text-3xl">{answerKey.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {answerKey.description && (
            <div className="whitespace-pre-line text-gray-700">{answerKey.description}</div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-gray-900">{answerKey.department.name}</p>
            </div>
            {answerKey.job && (
              <div>
                <p className="text-sm font-medium text-gray-500">Related Job</p>
                <Link href={`/jobs/${answerKey.job.slug}`} className="text-teal-600 hover:text-teal-700">
                  {answerKey.job.title}
                </Link>
              </div>
            )}
          </div>

          {answerKey.pdfUrl && (
            <Button asChild>
              <a href={answerKey.pdfUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Download Answer Key PDF
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {relatedKeys.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Related Answer Keys</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedKeys.map((rk) => (
              <Link key={rk.id} href={`/answer-key/${rk.slug}`}>
                <Card className="h-full border-gray-200 transition-colors hover:border-teal-300 hover:shadow-md">
                  <CardHeader>
                    <Badge variant="secondary" className="mb-2 text-xs w-fit">{rk.department.name}</Badge>
                    <CardTitle className="text-base">{rk.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{rk.description ? `${rk.description.slice(0, 100)}...` : ""}</p>
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
