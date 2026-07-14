import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { admitCardSchema } from "@/lib/validations"
import { Prisma } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const admitCard = await prisma.admitCard.findUnique({
      where: { id },
      include: { department: true, category: true, job: true },
    })

    if (!admitCard) {
      return NextResponse.json({ success: false, error: "Admit card not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: admitCard })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch admit card" },
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
    const existing = await prisma.admitCard.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: "Admit card not found" }, { status: 404 })
    }

    const body = await request.json()
    const validation = admitCardSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { title, slug, description, departmentId, categoryId, jobId, examDate, downloadUrl, status } = validation.data

    const data: Prisma.AdmitCardUpdateInput = {
      title,
      slug,
      ...(description !== undefined ? { description } : {}),
      department: { connect: { id: departmentId } },
      category: { connect: { id: categoryId } },
      ...(jobId ? { job: { connect: { id: jobId } } } : { job: { disconnect: true } }),
      ...(examDate !== undefined ? { examDate } : {}),
      ...(downloadUrl !== undefined ? { downloadUrl } : {}),
      ...(status !== undefined ? { status } : {}),
    }

    const admitCard = await prisma.admitCard.update({ where: { id }, data })

    return NextResponse.json({ success: true, data: admitCard })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update admit card" },
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
    const existing = await prisma.admitCard.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: "Admit card not found" }, { status: 404 })
    }

    await prisma.admitCard.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete admit card" },
      { status: 500 }
    )
  }
}
