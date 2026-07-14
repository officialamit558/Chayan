import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { admissionSchema } from "@/lib/validations"
import { Prisma } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const admission = await prisma.admission.findUnique({
      where: { id },
      include: { department: true, category: true },
    })

    if (!admission) {
      return NextResponse.json({ success: false, error: "Admission not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: admission })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch admission" },
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
    const existing = await prisma.admission.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: "Admission not found" }, { status: 404 })
    }

    const body = await request.json()
    const validation = admissionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { title, slug, description, departmentId, categoryId, startDate, lastDate, applicationFee, pdfUrl, status } =
      validation.data

    const data: Prisma.AdmissionUpdateInput = {
      title,
      slug,
      ...(description !== undefined ? { description } : {}),
      department: { connect: { id: departmentId } },
      category: { connect: { id: categoryId } },
      ...(startDate !== undefined ? { startDate } : {}),
      ...(lastDate !== undefined ? { lastDate } : {}),
      ...(applicationFee !== undefined ? { applicationFee } : {}),
      ...(pdfUrl !== undefined ? { pdfUrl } : {}),
      ...(status !== undefined ? { status } : {}),
    }

    const admission = await prisma.admission.update({ where: { id }, data })

    return NextResponse.json({ success: true, data: admission })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update admission" },
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
    const existing = await prisma.admission.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: "Admission not found" }, { status: 404 })
    }

    await prisma.admission.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete admission" },
      { status: 500 }
    )
  }
}
