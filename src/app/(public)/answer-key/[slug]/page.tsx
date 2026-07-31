import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatDate, getBaseUrl } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { AdBanner } from "@/components/ads/AdBanner"
import { DocumentDetail } from "@/components/documents/DocumentDetail"

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

      <AdBanner format="horizontal" className="mb-8" />

      <DocumentDetail
        kind="answer-key"
        title={answerKey.title}
        department={answerKey.department.name}
        category={answerKey.category.name}
        description={answerKey.description}
        rows={[
          { label: "Department", value: answerKey.department.name },
          { label: "Category", value: answerKey.category.name },
          { label: "Status", value: answerKey.status },
        ]}
        linkRows={answerKey.job ? [{ label: "Related Job", value: answerKey.job.title, href: `/jobs/${answerKey.job.slug}` }] : []}
        downloadUrl={answerKey.pdfUrl}
        downloadLabel="Download Answer Key PDF"
        relatedTitle="Related Answer Keys"
        relatedItems={relatedKeys.map((rk) => ({
          href: `/answer-key/${rk.slug}`,
          title: rk.title,
          department: rk.department.name,
          meta: rk.status || null,
        }))}
      />

      <AdBanner format="horizontal" className="mt-8" />
    </div>
  )
}
