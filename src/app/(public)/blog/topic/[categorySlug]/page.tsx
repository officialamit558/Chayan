import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getBaseUrl } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav"
import { AdBanner } from "@/components/ads/AdBanner"
import { FileText, FolderOpen, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PageProps {
  params: Promise<{ categorySlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params
  const category = await prisma.blogCategory.findUnique({ where: { slug: categorySlug } })
  if (!category) return { title: "Category Not Found" }

  const baseUrl = getBaseUrl()
  return {
    title: `${category.name} Articles & Guides | Chayan Blog`,
    description: category.description || `${category.name} articles, guides and resources on Chayan.`,
    alternates: { canonical: `${baseUrl}/blog/topic/${category.slug}` },
    openGraph: { title: `${category.name} | Chayan Blog`, description: category.description || undefined },
  }
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { categorySlug } = await params
  const category = await prisma.blogCategory.findUnique({
    where: { slug: categorySlug },
    include: { posts: { where: { published: true }, orderBy: { createdAt: "desc" }, take: 24, select: { id: true, title: true, slug: true, excerpt: true, views: true, createdAt: true } } },
  })

  if (!category) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `${getBaseUrl()}/blog/topic/${category.slug}`,
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <BreadcrumbNav
        segments={[
          { label: "Blog", href: "/blog" },
          { label: category.name, href: `/blog/topic/${category.slug}` },
        ]}
        className="mb-6"
      />

      <AdBanner format="horizontal" className="mb-8" />

      <header className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] via-blue-800 to-blue-700 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-amber-400/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <FolderOpen className="h-8 w-8" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Badge className="bg-amber-400 font-semibold text-amber-950">Category</Badge>
              <Badge className="bg-white/15 text-white backdrop-blur">{category.posts.length} articles</Badge>
            </div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{category.name}</h1>
            <p className="mt-1 text-sm text-blue-100 sm:text-base">{category.description}</p>
          </div>
        </div>
      </header>

      {category.posts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {category.posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 dark:hover:shadow-none"
            >
              <Badge variant="secondary" className="mb-2 text-xs">{category.name}</Badge>
              <h2 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300">
                {p.title}
              </h2>
              {p.excerpt && <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{p.excerpt}</p>}
              <p className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {p.views} views</span>
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-16 text-center dark:border-gray-700 dark:bg-gray-800">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h2 className="mb-2 text-lg font-semibold text-gray-900">No articles yet</h2>
          <p className="text-sm text-gray-500">New {category.name} articles are being written. Check back soon.</p>
        </div>
      )}

      <AdBanner format="horizontal" className="mt-10" />

      <div className="mt-6 text-center">
        <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
          View all blog categories →
        </Link>
      </div>
    </div>
  )
}