import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Newspaper, ArrowRight, Calendar, Clock3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const readingTime = (content?: string | null): number => {
  if (!content) return 2
  return Math.max(1, Math.round(content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length / 200))
}

export async function LatestBlog() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { category: true },
  })

  if (posts.length === 0) return null

  const [featured, ...rest] = posts

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          <Newspaper className="h-6 w-6 text-blue-600" /> From the Blog
        </h2>
        <Link
          href="/blog"
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          View all articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Link
          href={`/blog/${featured.slug}`}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] via-blue-800 to-blue-700 p-6 text-white shadow-lg transition-transform hover:-translate-y-0.5 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex h-full flex-col">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {featured.category && <Badge className="bg-amber-400 font-semibold text-amber-950">{featured.category.name}</Badge>}
              <Badge className="bg-white/15 text-white backdrop-blur">Featured</Badge>
            </div>
            <h3 className="line-clamp-3 text-xl font-bold leading-snug sm:text-2xl">{featured.title}</h3>
            {featured.excerpt && <p className="mt-3 line-clamp-3 text-sm text-blue-100">{featured.excerpt}</p>}
            <div className="mt-auto flex items-center gap-4 pt-6 text-xs text-blue-200">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(featured.createdAt)}</span>
              <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {readingTime(featured.content)} min read</span>
              <span className="ml-auto flex items-center gap-1 font-semibold text-amber-300">Read <ArrowRight className="h-3.5 w-3.5" /></span>
            </div>
          </div>
        </Link>

        <div className="grid gap-4">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700"
            >
              <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                {post.category && <Badge variant="secondary" className="text-[10px]">{post.category.name}</Badge>}
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(post.createdAt)}</span>
              </div>
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300">
                {post.title}
              </h3>
              <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                <Clock3 className="h-3 w-3" /> {readingTime(post.content)} min read
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
