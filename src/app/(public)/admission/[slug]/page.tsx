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

      <Card className="mb-8">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{admission.department.name}</Badge>
            {admission.category && <Badge>{admission.category.name}</Badge>}
          </div>
          <CardTitle className="text-2xl sm:text-3xl">{admission.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {admission.description && (
            <div className="whitespace-pre-line text-gray-700">{admission.description}</div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {admission.startDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-gray-900">{formatDate(admission.startDate)}</p>
              </div>
            )}
            {admission.lastDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Last Date</p>
                <p className="text-gray-900">{formatDate(admission.lastDate)}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-gray-900">{admission.department.name}</p>
            </div>
            {admission.applicationFee && (
              <div>
                <p className="text-sm font-medium text-gray-500">Application Fee</p>
                <p className="text-gray-900">{admission.applicationFee}</p>
              </div>
            )}
          </div>

          {admission.pdfUrl && (
            <Button asChild>
              <a href={admission.pdfUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Download Notification PDF
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {relatedAdmissions.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Related Admissions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedAdmissions.map((ra) => (
              <Link key={ra.id} href={`/admission/${ra.slug}`}>
                <Card className="h-full border-gray-200 transition-colors hover:border-teal-300 hover:shadow-md">
                  <CardHeader>
                    <Badge variant="secondary" className="mb-2 text-xs w-fit">{ra.department.name}</Badge>
                    <CardTitle className="text-base">{ra.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      {ra.lastDate ? `Last Date: ${formatDate(ra.lastDate)}` : ""}
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
