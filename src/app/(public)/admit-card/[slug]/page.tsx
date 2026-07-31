import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatDate, getBaseUrl } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { AdBanner } from "@/components/ads/AdBanner"
import { DocumentDetail } from "@/components/documents/DocumentDetail"

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

      <DocumentDetail
        kind="admit-card"
        title={admitCard.title}
        department={admitCard.department.name}
        category={admitCard.category.name}
        description={admitCard.description}
        rows={[
          { label: "Exam Date", value: admitCard.examDate ? formatDate(admitCard.examDate) : null },
          { label: "Department", value: admitCard.department.name },
          { label: "Category", value: admitCard.category.name },
          { label: "Status", value: admitCard.status },
        ]}
        linkRows={admitCard.job ? [{ label: "Related Job", value: admitCard.job.title, href: `/jobs/${admitCard.job.slug}` }] : []}
        downloadUrl={admitCard.downloadUrl}
        downloadLabel="Download Admit Card"
        countdownDate={admitCard.examDate ? admitCard.examDate.toISOString() : null}
        countdownLabel="Exam Date"
        bookmarkId={{ type: "admit-card", id: admitCard.id }}
        relatedTitle="Related Admit Cards"
        relatedItems={relatedCards.map((rc) => ({
          href: `/admit-card/${rc.slug}`,
          title: rc.title,
          department: rc.department.name,
          meta: rc.examDate ? `Exam Date: ${formatDate(rc.examDate)}` : null,
        }))}
      />

      <AdBanner format="horizontal" className="mt-8" />
    </div>
  )
}
