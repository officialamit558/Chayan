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
  const admitCard = await prisma.admitCard.findUnique({
    where: { slug },
    include: { department: true },
  })

  if (!admitCard) return { title: "Admit Card Not Found" }

  const baseUrl = getBaseUrl()

  return {
    title: admitCard.title,
    description: `${admitCard.title} - ${admitCard.department.name}${admitCard.examDate ? ` | Exam Date: ${formatDate(admitCard.examDate)}` : ""}${admitCard.description ? ` | ${admitCard.description}` : ""}`,
    alternates: { canonical: `${baseUrl}/admit-card/${admitCard.slug}` },
    twitter: { card: "summary_large_image", title: `${admitCard.title} | Chayan`, description: `${admitCard.department.name}${admitCard.examDate ? ` - Exam: ${formatDate(admitCard.examDate)}` : ""}` },
  }
}

export default async function AdmitCardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const admitCard = await prisma.admitCard.findUnique({
    where: { slug },
    include: { department: true, category: true, job: true },
  })

  if (!admitCard) notFound()

  const relatedCards = await prisma.admitCard.findMany({
    where: {
      departmentId: admitCard.departmentId,
      id: { not: admitCard.id },
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
      { "@type": "ListItem", position: 2, name: "Admit Cards", item: `${getBaseUrl()}/admit-cards` },
      { "@type": "ListItem", position: 3, name: admitCard.title, item: `${getBaseUrl()}/admit-card/${admitCard.slug}` },
    ],
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadCrumbLd) }} />
      <BreadcrumbNav
        segments={[
          { label: "Admit Cards", href: "/admit-cards" },
          { label: admitCard.title, href: `/admit-card/${admitCard.slug}` },
        ]}
        className="mb-6"
      />

      <AdBanner format="horizontal" className="mb-8" />

      <Card className="mb-8">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{admitCard.department.name}</Badge>
            {admitCard.category && <Badge>{admitCard.category.name}</Badge>}
          </div>
          <CardTitle className="text-2xl sm:text-3xl">{admitCard.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {admitCard.description && (
            <div className="whitespace-pre-line text-gray-700">{admitCard.description}</div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {admitCard.examDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Exam Date</p>
                <p className="text-gray-900">{formatDate(admitCard.examDate)}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-gray-900">{admitCard.department.name}</p>
            </div>
            {admitCard.job && (
              <div>
                <p className="text-sm font-medium text-gray-500">Related Job</p>
                <Link href={`/jobs/${admitCard.job.slug}`} className="text-teal-600 hover:text-teal-700">
                  {admitCard.job.title}
                </Link>
              </div>
            )}
          </div>

          {admitCard.downloadUrl && (
            <Button size="lg" asChild>
              <a href={admitCard.downloadUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-5 w-5" />
                Download Admit Card
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      <AdBanner format="horizontal" />

      {relatedCards.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Related Admit Cards</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedCards.map((rc) => (
              <Link key={rc.id} href={`/admit-card/${rc.slug}`}>
                <Card className="h-full border-gray-200 transition-colors hover:border-teal-300 hover:shadow-md">
                  <CardHeader>
                    <Badge variant="secondary" className="mb-2 text-xs w-fit">{rc.department.name}</Badge>
                    <CardTitle className="text-base">{rc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      {rc.examDate ? `Exam Date: ${formatDate(rc.examDate)}` : ""}
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
