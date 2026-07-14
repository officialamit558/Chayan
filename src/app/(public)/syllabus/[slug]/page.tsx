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
  const syllabus = await prisma.syllabus.findUnique({
    where: { slug },
    include: { department: true },
  })

  if (!syllabus) return { title: "Syllabus Not Found" }

  const baseUrl = getBaseUrl()

  return {
    title: syllabus.title,
    description: `${syllabus.title} - ${syllabus.department.name}${syllabus.subjects ? ` | Subjects: ${syllabus.subjects}` : ""}${syllabus.description ? ` | ${syllabus.description}` : ""}`,
    alternates: { canonical: `${baseUrl}/syllabus/${syllabus.slug}` },
    twitter: { card: "summary_large_image", title: `${syllabus.title} | Chayan`, description: `${syllabus.department.name} - ${syllabus.subjects ? `Subjects: ${syllabus.subjects}` : "Download syllabus"}` },
  }
}

export default async function SyllabusDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const syllabus = await prisma.syllabus.findUnique({
    where: { slug },
    include: { department: true, category: true, job: true },
  })

  if (!syllabus) notFound()

  const relatedSyllabus = await prisma.syllabus.findMany({
    where: {
      departmentId: syllabus.departmentId,
      id: { not: syllabus.id },
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
      { "@type": "ListItem", position: 2, name: "Syllabus", item: `${getBaseUrl()}/syllabus` },
      { "@type": "ListItem", position: 3, name: syllabus.title, item: `${getBaseUrl()}/syllabus/${syllabus.slug}` },
    ],
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadCrumbLd) }} />
      <BreadcrumbNav
        segments={[
          { label: "Syllabus", href: "/syllabus" },
          { label: syllabus.title, href: `/syllabus/${syllabus.slug}` },
        ]}
        className="mb-6"
      />

      <Card className="mb-8">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{syllabus.department.name}</Badge>
            {syllabus.category && <Badge>{syllabus.category.name}</Badge>}
          </div>
          <CardTitle className="text-2xl sm:text-3xl">{syllabus.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {syllabus.description && (
            <div className="whitespace-pre-line text-gray-700">{syllabus.description}</div>
          )}

          {syllabus.subjects && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">Subjects / Topics</p>
              <div className="whitespace-pre-line text-gray-900">{syllabus.subjects}</div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-gray-900">{syllabus.department.name}</p>
            </div>
            {syllabus.job && (
              <div>
                <p className="text-sm font-medium text-gray-500">Related Job</p>
                <Link href={`/jobs/${syllabus.job.slug}`} className="text-blue-600 hover:text-blue-700">
                  {syllabus.job.title}
                </Link>
              </div>
            )}
          </div>

          {syllabus.pdfUrl && (
            <Button asChild>
              <a href={syllabus.pdfUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Download Syllabus PDF
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {relatedSyllabus.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Related Syllabus</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedSyllabus.map((rs) => (
              <Link key={rs.id} href={`/syllabus/${rs.slug}`}>
                <Card className="h-full border-gray-200 transition-colors hover:border-blue-300 hover:shadow-md">
                  <CardHeader>
                    <Badge variant="secondary" className="mb-2 text-xs w-fit">{rs.department.name}</Badge>
                    <CardTitle className="text-base">{rs.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{rs.subjects ? `${rs.subjects.slice(0, 100)}...` : ""}</p>
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
