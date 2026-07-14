import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { commentSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId") || ""
    const resultId = searchParams.get("resultId") || ""
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")))
    const skip = (page - 1) * limit

    if (!jobId && !resultId) {
      return NextResponse.json(
        { success: false, error: "Must provide jobId or resultId" },
        { status: 400 }
      )
    }

    const where = jobId ? { jobId } : { resultId }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = commentSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { content, jobId, resultId } = validation.data

    if (!jobId && !resultId) {
      return NextResponse.json(
        { success: false, error: "Must provide jobId or resultId" },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        ...(jobId ? { jobId } : {}),
        ...(resultId ? { resultId } : {}),
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    return NextResponse.json({ success: true, data: comment }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create comment" },
      { status: 500 }
    )
  }
}
