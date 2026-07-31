import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatDate, getBaseUrl } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, Clock3, Tag } from "lucide-react"
import { AdBanner } from "@/components/ads/AdBanner"
import { ShareButtons } from "@/components/blog/ShareButtons"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) return { title: "Post Not Found" }

  const baseUrl = getBaseUrl()
  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: `${baseUrl}/blog/${post.slug}` },
    twitter: { card: "summary_large_image", title: `${post.title} | Chayan Blog`, description: post.excerpt || post.title },
    openGraph: { title: post.title, description: post.excerpt || post.title },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post || !post.published) notFound()

  const relatedPosts = await prisma.blogPost.findMany({
    where: { id: { not: post.id }, published: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  const breadCrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getBaseUrl() },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${getBaseUrl()}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${getBaseUrl()}/blog/${post.slug}` },
    ],
  }

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author || "Chayan Team" },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    publisher: { "@type": "Organization", name: "Chayan" },
  }

  const tags = post.tags ? post.tags.split(",").map((t) => t.trim()) : []

  const plainText = post.content ? post.content.replace(/<[^>]+>/g, " ") : ""
  const readingTime = Math.max(1, Math.round(plainText.trim().split(/\s+/).length / 200))

  const authorName = post.author || "Chayan Team"

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadCrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <BreadcrumbNav
        segments={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
        className="mb-6"
      />

      <AdBanner format="horizontal" className="mb-8" />

      <article>
        <header className="mb-8">
          <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#1e3a5f] to-blue-700 text-base font-bold text-white">
                {authorName.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{authorName}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {readingTime} min read</span>
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views} views</span>
                </div>
              </div>
            </div>
          </div>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </header>

        {post.image && (
          <div className="mb-8 overflow-hidden rounded-xl shadow-sm">
            <img src={post.image} alt={post.title} className="w-full object-cover max-h-96" />
          </div>
        )}

        {post.excerpt && (
          <p className="mb-6 border-l-4 border-blue-600 pl-4 text-lg font-medium leading-relaxed text-gray-700 italic">
            {post.excerpt}
          </p>
        )}

        <AdBanner format="horizontal" />

        {post.content && (
          <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-h2:text-2xl prose-h3:text-xl mt-6">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        )}

        <AdBanner format="horizontal" className="mt-8" />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
          <ShareButtons title={post.title} url={`${getBaseUrl()}/blog/${post.slug}`} />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Tag className="h-3.5 w-3.5" />
            {tags.length > 0 ? tags.slice(0, 3).join(" · ") : "Career Guidance"}
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">Related Articles</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Link key={rp.id} href={`/blog/${rp.slug}`} className="group flex flex-col">
                <Card className="flex h-full flex-col overflow-hidden border-gray-200 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100">
                  {rp.image && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img src={rp.image} alt={rp.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  )}
                  <CardHeader className={rp.image ? "pb-2" : ""}>
                    <CardTitle className="line-clamp-2 text-base leading-snug text-gray-900 group-hover:text-blue-700">{rp.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    {rp.excerpt && <p className="mb-3 text-sm text-gray-600 line-clamp-2">{rp.excerpt}</p>}
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5" /> {formatDate(rp.createdAt)}
                      <span className="mx-1">•</span>
                      <Clock3 className="h-3.5 w-3.5" /> {Math.max(1, Math.round((rp.content ? rp.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length : 0) / 200))} min read
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
