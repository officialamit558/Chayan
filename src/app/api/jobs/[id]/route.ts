import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { jobSchema } from "@/lib/validations"
import { Prisma } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const job = await prisma.job.findUnique({
      where: { id },
      include: { department: true, category: true, state: true },
    })

    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch job" },
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
    const existing = await prisma.job.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    const body = await request.json()
    const validation = jobSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const {
      title,
      slug,
      departmentId,
      categoryId,
      stateId,
      advertisementNo,
      totalVacancies,
      salary,
      location,
      ageLimit,
      ageRelaxation,
      education,
      selectionProcess,
      applicationFee,
      importantDates,
      documentsRequired,
      howToApply,
      officialNotification,
      officialWebsite,
      applyLink,
      status,
      experience,
      startDate,
      lastDate,
    } = validation.data

    const data: Prisma.JobUpdateInput = {
      title,
      slug,
      department: { connect: { id: departmentId } },
      category: { connect: { id: categoryId } },
      ...(stateId ? { state: { connect: { id: stateId } } } : { state: { disconnect: true } }),
      ...(advertisementNo !== undefined ? { advertisementNo } : {}),
      ...(totalVacancies !== undefined ? { totalVacancies } : {}),
      ...(salary !== undefined ? { salary } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(ageLimit !== undefined ? { ageLimit } : {}),
      ...(ageRelaxation !== undefined ? { ageRelaxation } : {}),
      ...(education !== undefined ? { education } : {}),
      ...(selectionProcess !== undefined ? { selectionProcess } : {}),
      ...(applicationFee !== undefined ? { applicationFee } : {}),
      ...(importantDates !== undefined ? { importantDates } : {}),
      ...(documentsRequired !== undefined ? { documentsRequired } : {}),
      ...(howToApply !== undefined ? { howToApply } : {}),
      ...(officialNotification !== undefined ? { officialNotification } : {}),
      ...(officialWebsite !== undefined ? { officialWebsite } : {}),
      ...(applyLink !== undefined ? { applyLink } : {}),
      ...(experience !== undefined ? { experience } : {}),
      ...(startDate !== undefined ? { startDate } : {}),
      ...(lastDate !== undefined ? { lastDate } : {}),
      status: status || "ACTIVE",
    }

    const job = await prisma.job.update({ where: { id }, data })

    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update job" },
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
    const existing = await prisma.job.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    await prisma.job.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete job" },
      { status: 500 }
    )
  }
}
