import { prisma } from "@/lib/prisma"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const jobs = await prisma.job.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { department: true, category: true },
  })

  const items = jobs
    .map(
      (job) => `
    <item>
      <title><![CDATA[${job.title}]]></title>
      <link>${baseUrl}/apply/${job.slug}</link>
      <description><![CDATA[${job.department.name} - ${job.category.name}${job.totalVacancies ? ` - ${job.totalVacancies} vacancies` : ""}]]></description>
      <pubDate>${job.createdAt.toUTCString()}</pubDate>
      <guid>${baseUrl}/apply/${job.slug}</guid>
    </item>`
    )
    .join("\n")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Chayan - Latest Government Jobs</title>
    <link>${baseUrl}</link>
    <description>select right. serve right. — Your trusted government job portal. Latest notifications, results, admit cards, answer keys and more.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
