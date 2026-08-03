import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (!post) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to record view" },
      { status: 500 }
    )
  }
}