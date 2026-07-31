import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatDate, getBaseUrl } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { AdBanner } from "@/components/ads/AdBanner"
import { DocumentDetail } from "@/components/documents/DocumentDetail"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const admission = await prisma.admission.findUnique({
    where: { slug },
    include: { department: true },
  })

  if (!admission) return { title: "Admission Not Found" }

  const baseUrl = getBaseUrl()

  return {
    title: admission.title,
    description: `${admission.title} - ${admission.department.name}${admission.startDate ? ` | Apply from: ${formatDate(admission.startDate)}` : ""}${admission.lastDate ? ` to ${formatDate(admission.lastDate)}` : ""}`,
    alternates: { canonical: `${baseUrl}/admission/${admission.slug}` },
    twitter: { card: "summary_large_image", title: `${admission.title} | Chayan`, description: `${admission.department.name} - ${admission.lastDate ? `Last date: ${formatDate(admission.lastDate)}` : ""}` },
  }
}

export default async function AdmissionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const admission = await prisma.admission.findUnique({
    where: { slug },
    include: { department: true, category: true },
  })

  if (!admission) notFound()

  const relatedAdmissions = await prisma.admission.findMany({
    where: {
      departmentId: admission.departmentId,
      id: { not: admission.id },
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
      { "@type": "ListItem", position: 2, name: "Admissions", item: `${getBaseUrl()}/admissions` },
      { "@type": "ListItem", position: 3, name: admission.title, item: `${getBaseUrl()}/admission/${admission.slug}` },
    ],
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadCrumbLd) }} />
      <BreadcrumbNav
        segments={[
          { label: "Admissions", href: "/admissions" },
          { label: admission.title, href: `/admission/${admission.slug}` },
        ]}
        className="mb-6"
      />

      <AdBanner format="horizontal" className="mb-8" />

      <DocumentDetail
        kind="admission"
        title={admission.title}
        department={admission.department.name}
        category={admission.category.name}
        description={admission.description}
        rows={[
          { label: "Start Date", value: admission.startDate ? formatDate(admission.startDate) : null },
          { label: "Last Date", value: admission.lastDate ? formatDate(admission.lastDate) : null },
          { label: "Application Fee", value: admission.applicationFee },
          { label: "Department", value: admission.department.name },
          { label: "Category", value: admission.category.name },
          { label: "Status", value: admission.status },
        ]}
        downloadUrl={admission.pdfUrl}
        downloadLabel="Download Notification PDF"
        countdownDate={admission.lastDate ? admission.lastDate.toISOString() : null}
        countdownLabel="Last Date to Apply"
        relatedTitle="Related Admissions"
        relatedItems={relatedAdmissions.map((ra) => ({
          href: `/admission/${ra.slug}`,
          title: ra.title,
          department: ra.department.name,
          meta: ra.lastDate ? `Last Date: ${formatDate(ra.lastDate)}` : null,
        }))}
      />

      <AdBanner format="horizontal" className="mt-8" />
    </div>
  )
}
