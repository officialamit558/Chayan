import { prisma } from "@/lib/prisma"

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "")

  let jobs: { slug: string; updatedAt: Date }[] = []
  let results: { slug: string; createdAt: Date }[] = []
  let admitCards: { slug: string; createdAt: Date }[] = []
  let answerKeys: { slug: string; createdAt: Date }[] = []
  let admissions: { slug: string; createdAt: Date }[] = []
  let syllabi: { slug: string; createdAt: Date }[] = []
  let blogPosts: { slug: string; updatedAt: Date }[] = []
  let categories: { slug: string }[] = []

  try {
    const data = await Promise.all([
      prisma.job.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.result.findMany({ select: { slug: true, createdAt: true } }),
      prisma.admitCard.findMany({ select: { slug: true, createdAt: true } }),
      prisma.answerKey.findMany({ select: { slug: true, createdAt: true } }),
      prisma.admission.findMany({ select: { slug: true, createdAt: true } }),
      prisma.syllabus.findMany({ select: { slug: true, createdAt: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true } }),
    ])
    jobs = data[0]
    results = data[1]
    admitCards = data[2]
    answerKeys = data[3]
    admissions = data[4]
    syllabi = data[5]
    blogPosts = data[6]
    categories = data[7]
  } catch {
    // Database unavailable during build, return static pages only
  }

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 1 },
    { url: `${baseUrl}/notifications`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/sitemap`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.3 },
  ]

  const jobPages = jobs.map((job) => ({
    url: `${baseUrl}/apply/${job.slug}`,
    lastModified: job.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const resultPages = results.map((result) => ({
    url: `${baseUrl}/result/${result.slug}`,
    lastModified: result.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const admitCardPages = admitCards.map((card) => ({
    url: `${baseUrl}/admit-card/${card.slug}`,
    lastModified: card.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const answerKeyPages = answerKeys.map((key) => ({
    url: `${baseUrl}/answer-key/${key.slug}`,
    lastModified: key.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const admissionPages = admissions.map((admission) => ({
    url: `${baseUrl}/admission/${admission.slug}`,
    lastModified: admission.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const syllabusPages = syllabi.map((syllabus) => ({
    url: `${baseUrl}/syllabus/${syllabus.slug}`,
    lastModified: syllabus.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }))

  return [
    ...staticPages,
    ...jobPages,
    ...resultPages,
    ...admitCardPages,
    ...answerKeyPages,
    ...admissionPages,
    ...syllabusPages,
    ...blogPages,
    ...categoryPages,
  ]
}
