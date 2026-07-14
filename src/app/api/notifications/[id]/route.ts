import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notificationSchema } from "@/lib/validations"
import { Prisma } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const notification = await prisma.notification.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!notification) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: notification })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch notification" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const existing = await prisma.notification.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 })
    }

    const body = await request.json()
    const validation = notificationSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { title, slug, content, categoryId, type, isTrending } = validation.data

    const data: Prisma.NotificationUpdateInput = {
      title,
      slug,
      ...(content !== undefined ? { content } : {}),
      category: { connect: { id: categoryId } },
      ...(type !== undefined ? { type } : {}),
      isTrending: isTrending || false,
    }

    const notification = await prisma.notification.update({ where: { id }, data })

    return NextResponse.json({ success: true, data: notification })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update notification" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const existing = await prisma.notification.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 })
    }

    await prisma.notification.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete notification" },
      { status: 500 }
    )
  }
}
