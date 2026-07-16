import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatDate, getBaseUrl } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye } from "lucide-react"
import { AdBanner } from "@/components/ads/AdBanner"

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
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {formatDate(post.createdAt)}</span>
            {post.author && <span className="flex items-center gap-1"><User className="h-4 w-4" /> {post.author}</span>}
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {post.views} views</span>
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
          <div className="mb-8 overflow-hidden rounded-lg">
            <img src={post.image} alt={post.title} className="w-full object-cover max-h-96" />
          </div>
        )}

        {post.excerpt && (
          <p className="mb-6 text-lg text-gray-600 leading-relaxed">{post.excerpt}</p>
        )}

        <AdBanner format="horizontal" />

        {post.content && (
          <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-teal-600 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        )}

        <AdBanner format="horizontal" className="mt-8" />
      </article>

      {relatedPosts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Related Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Link key={rp.id} href={`/blog/${rp.slug}`}>
                <Card className="h-full border-gray-200 transition-colors hover:border-teal-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">{rp.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {rp.excerpt && <p className="text-sm text-gray-600 line-clamp-2">{rp.excerpt}</p>}
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
