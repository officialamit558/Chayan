import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getBaseUrl } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { AdBanner } from "@/components/ads/AdBanner"
import { Badge } from "@/components/ui/badge"
import { Tag, Eye, FileText } from "lucide-react"

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const baseUrl = getBaseUrl()
  const label = tag.replace(/-/g, " ")
  return {
    title: `${label.charAt(0).toUpperCase() + label.slice(1)} Articles | Chayan Blog`,
    description: `Articles tagged "${label}" on Chayan Blog.`,
    alternates: { canonical: `${baseUrl}/blog/tag/${tag}` },
  }
}

export default async function BlogTagPage({ params }: PageProps) {
  const { tag } = await params

  const posts = await prisma.blogPost.findMany({
    where: { published: true, tags: { contains: tag } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { category: true },
  })

  if (posts.length === 0) notFound()

  const label = tag.replace(/-/g, " ")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: label,
    url: `${getBaseUrl()}/blog/tag/${tag}`,
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <BreadcrumbNav
        segments={[
          { label: "Blog", href: "/blog" },
          { label: `Tag: ${label}`, href: `/blog/tag/${tag}` },
        ]}
        className="mb-6"
      />

      <AdBanner format="horizontal" className="mb-8" />

      <header className="mb-8 flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900">
          <Tag className="h-6 w-6 text-blue-600 dark:text-blue-300" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize dark:text-gray-100">{label}</h1>
          <p className="text-sm text-gray-500">{posts.length} articles</p>
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 dark:hover:shadow-none"
          >
            {p.category && <Badge variant="secondary" className="mb-2 text-xs">{p.category.name}</Badge>}
            <h2 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300">
              {p.title}
            </h2>
            <p className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {p.views} views</span>
            </p>
          </Link>
        ))}
      </div>

      <AdBanner format="horizontal" className="mt-10" />
    </div>
  )
}