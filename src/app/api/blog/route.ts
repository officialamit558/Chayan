import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { blogPostSchema } from "@/lib/validations"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")))
    const search = searchParams.get("search") || ""
    const published = searchParams.get("published")
    const skip = (page - 1) * limit

    const where: Prisma.BlogPostWhereInput = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ]
    }

    if (published === "true") where.published = true
    if (published === "false") where.published = false

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = blogPostSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 })
    }

    const { title, slug, excerpt, content, author, image, tags, published } = validation.data

    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ success: false, error: "A post with this slug already exists" }, { status: 409 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        ...(excerpt !== undefined && excerpt !== null ? { excerpt } : {}),
        ...(content !== undefined && content !== null ? { content } : {}),
        ...(author !== undefined && author !== null ? { author } : {}),
        ...(image !== undefined && image !== null ? { image } : {}),
        ...(tags !== undefined && tags !== null ? { tags } : {}),
        published,
      },
    })

    return NextResponse.json({ success: true, data: post }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create blog post" },
      { status: 500 }
    )
  }
}
