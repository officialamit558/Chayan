import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { CategoryClient } from "./category-client"

const slugMap: Record<string, string> = {
  central: "central-govt",
  state: "state-govt",
  bank: "banking",
  railway: "railways",
  defence: "defence",
  teaching: "teaching",
  police: "police",
  engineering: "engineering",
  medical: "medical",
  public_sector: "public-sector",
  judiciary: "judiciary",
  research: "research",
}

async function getCategory(slug: string) {
  const dbSlug = slugMap[slug] || slug
  return prisma.category.findUnique({
    where: { slug: dbSlug },
    include: { _count: { select: { job: true } } },
  })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return { title: "Category Not Found" }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://chayanjobs.com"
  return {
    title: `${category.name} Jobs`,
    description: `Browse latest ${category.name} government jobs. Find current openings, notifications, and application details for ${category.name} positions.`,
    alternates: { canonical: `${baseUrl}/category/${slug}` },
    twitter: { card: "summary_large_image", title: `${category.name} Jobs | Chayan`, description: `Browse latest ${category.name} government jobs across India.` },
  }
}

export const dynamic = "force-dynamic"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()

  return <CategoryClient category={{ id: category.id, name: category.name, slug: category.slug, jobCount: category._count.job }} />
}
