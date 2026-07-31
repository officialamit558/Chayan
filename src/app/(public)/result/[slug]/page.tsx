import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatDate, getBaseUrl } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { AdBanner } from "@/components/ads/AdBanner"
import { DocumentDetail } from "@/components/documents/DocumentDetail"

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

      <DocumentDetail
        kind="result"
        title={result.title}
        department={result.department.name}
        category={result.category.name}
        description={result.description}
        rows={[
          { label: "Result Date", value: result.resultDate ? formatDate(result.resultDate) : null },
          { label: "Department", value: result.department.name },
          { label: "Category", value: result.category.name },
          { label: "Status", value: result.status },
        ]}
        linkRows={result.job ? [{ label: "Related Job", value: result.job.title, href: `/jobs/${result.job.slug}` }] : []}
        downloadUrl={result.pdfUrl}
        downloadLabel="Download Result PDF"
        bookmarkId={{ type: "result", id: result.id }}
        relatedTitle="Related Results"
        relatedItems={relatedResults.map((rr) => ({
          href: `/result/${rr.slug}`,
          title: rr.title,
          department: rr.department.name,
          meta: rr.resultDate ? `Result Date: ${formatDate(rr.resultDate)}` : null,
        }))}
      />

      <AdBanner format="horizontal" className="mt-8" />
    </div>
  )
}
