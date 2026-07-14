import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { bookmarkSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")))
    const skip = (page - 1) * limit

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId: session.user.id },
        include: {
          job: { include: { department: true, category: true, state: true } },
          result: { include: { department: true, category: true } },
          admitCard: { include: { department: true, category: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.bookmark.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({
      success: true,
      data: bookmarks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch bookmarks" },
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
    const validation = bookmarkSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { jobId, resultId, admitCardId } = validation.data

    if (!jobId && !resultId && !admitCardId) {
      return NextResponse.json(
        { success: false, error: "Must provide jobId, resultId, or admitCardId" },
        { status: 400 }
      )
    }

    const existing = await prisma.bookmark.findFirst({
      where: {
        userId: session.user.id,
        ...(jobId ? { jobId } : {}),
        ...(resultId ? { resultId } : {}),
        ...(admitCardId ? { admitCardId } : {}),
      },
    })

    if (existing) {
      return NextResponse.json({ success: false, error: "Bookmark already exists" }, { status: 409 })
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        ...(jobId ? { jobId } : {}),
        ...(resultId ? { resultId } : {}),
        ...(admitCardId ? { admitCardId } : {}),
      },
    })

    return NextResponse.json({ success: true, data: bookmark }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create bookmark" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Bookmark id is required" }, { status: 400 })
    }

    const bookmark = await prisma.bookmark.findUnique({ where: { id } })
    if (!bookmark) {
      return NextResponse.json({ success: false, error: "Bookmark not found" }, { status: 404 })
    }

    if (bookmark.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    await prisma.bookmark.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete bookmark" },
      { status: 500 }
    )
  }
}
