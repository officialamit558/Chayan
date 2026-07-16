import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { JobDetailContent } from "@/components/jobs/JobDetailContent"
import { AdBanner } from "@/components/ads/AdBanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, getBaseUrl } from "@/lib/utils"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const job = await prisma.job.findUnique({
    where: { slug },
    include: { department: true, category: true },
  })

  if (!job) return { title: "Job Not Found" }

  const baseUrl = getBaseUrl()

  return {
    title: job.title,
    description: `${job.title} - ${job.department.name} | ${job.totalVacancies ? `${job.totalVacancies} vacancies` : ""} | Apply before ${job.lastDate ? formatDate(job.lastDate) : "N/A"}`,
    alternates: { canonical: `${baseUrl}/apply/${job.slug}` },
    twitter: { card: "summary_large_image", title: `${job.title} | Chayan`, description: `${job.department.name} - ${job.location || "All India"} | ${job.salary || "As per norms"}` },
    openGraph: {
      title: job.title,
      description: `Department: ${job.department.name} | Location: ${job.location || "All India"} | Salary: ${job.salary || "As per norms"}`,
    },
  }
}

export default async function ApplyJobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const job = await prisma.job.findUnique({
    where: { slug },
    include: { department: true, category: true, state: true },
  })

  if (!job) notFound()

  const relatedJobs = await prisma.job.findMany({
    where: {
      departmentId: job.departmentId,
      id: { not: job.id },
      status: "ACTIVE",
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
      { "@type": "ListItem", position: 2, name: "Jobs", item: `${getBaseUrl()}/jobs` },
      { "@type": "ListItem", position: 3, name: job.title, item: `${getBaseUrl()}/apply/${job.slug}` },
    ],
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.education || job.title,
    datePosted: job.startDate || job.createdAt,
    validThrough: job.lastDate || undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: job.department.name,
    },
    jobLocation: job.location
      ? {
          "@type": "Place",
          address: { "@type": "PostalAddress", addressLocality: job.location },
        }
      : undefined,
    ...(job.totalVacancies ? { numberOfPositions: job.totalVacancies } : {}),
    ...(job.salary ? { baseSalary: { "@type": "MonetaryAmount", value: job.salary } } : {}),
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadCrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <BreadcrumbNav
        segments={[
          { label: "Jobs", href: "/jobs" },
          { label: job.title, href: `/apply/${job.slug}` },
        ]}
        className="mb-6"
      />

      <AdBanner format="horizontal" className="mb-8" />

      <JobDetailContent
        title={job.title}
        department={job.department.name}
        departmentId={job.department.id}
        advertisementNo={job.advertisementNo}
        totalVacancies={job.totalVacancies}
        salary={job.salary}
        location={job.location}
        ageLimit={job.ageLimit}
        ageRelaxation={job.ageRelaxation}
        education={job.education}
        selectionProcess={job.selectionProcess}
        applicationFee={job.applicationFee}
        importantDates={job.importantDates as Record<string, string> | null}
        documentsRequired={job.documentsRequired}
        howToApply={job.howToApply}
        officialNotification={job.officialNotification}
        officialWebsite={job.officialWebsite}
        applyLink={job.applyLink}
        experience={job.experience}
        startDate={job.startDate?.toISOString() || null}
        lastDate={job.lastDate?.toISOString() || null}
        slug={job.slug}
      />

      <AdBanner format="horizontal" className="mt-8" />

      {relatedJobs.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Related Jobs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedJobs.map((rj) => (
              <Link key={rj.id} href={`/apply/${rj.slug}`}>
                <Card className="h-full border-gray-200 transition-colors hover:border-teal-300 hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">{rj.department.name}</Badge>
                        <CardTitle className="text-base">{rj.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm text-gray-600">
                      {rj.location && <p>Location: {rj.location}</p>}
                      {rj.lastDate && <p>Last Date: {formatDate(rj.lastDate)}</p>}
                      {rj.totalVacancies && <p>Vacancies: {rj.totalVacancies}</p>}
                    </div>
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
