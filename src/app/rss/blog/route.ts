import { prisma } from "@/lib/prisma"

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "")

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { category: true },
  })

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description><![CDATA[${post.excerpt || ""}${post.category ? ` [${post.category.name}]` : ""}]]></description>
      <pubDate>${post.createdAt.toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}</guid>
    </item>`
    )
    .join("\n")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Chayan Blog - Guides on Careers, AI, Money & Learning</title>
    <link>${baseUrl}/blog</link>
    <description>Practical guides on careers, skills, AI, personal finance, study techniques and productivity — plus government job and exam updates.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss/blog" rel="self" type="application/rss+xml"/>
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
