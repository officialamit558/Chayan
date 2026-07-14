import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") || ""
    const category = searchParams.get("category") || ""
    const department = searchParams.get("department") || ""
    const state = searchParams.get("state") || ""
    const status = searchParams.get("status") || ""
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")))
    const sort = searchParams.get("sort") || "createdAt"
    const orderParam = searchParams.get("order") || "desc"
    const order: "asc" | "desc" = orderParam === "asc" ? "asc" : "desc"

    const skip = (page - 1) * limit

    const baseWhere = {
      ...(q
        ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }] }
        : {}),
      ...(category ? { categoryId: category } : {}),
      ...(department ? { departmentId: department } : {}),
    }

    const jobWhere: Record<string, unknown> = { ...baseWhere }
    if (state) jobWhere.stateId = state
    if (status) jobWhere.status = status

    const resultWhere = { ...baseWhere }
    const admitCardWhere = { ...baseWhere }
    const answerKeyWhere = { ...baseWhere }

    const [jobs, results, admitCards, answerKeys] = await Promise.all([
      prisma.job.findMany({
        where: jobWhere,
        include: { department: true, category: true, state: true },
        orderBy: { [sort === "title" ? "title" : "createdAt"]: order },
        skip,
        take: limit,
      }),
      prisma.result.findMany({
        where: resultWhere,
        include: { department: true, category: true },
        orderBy: { createdAt: order },
        skip,
        take: limit,
      }),
      prisma.admitCard.findMany({
        where: admitCardWhere,
        include: { department: true, category: true },
        orderBy: { createdAt: order },
        skip,
        take: limit,
      }),
      prisma.answerKey.findMany({
        where: answerKeyWhere,
        include: { department: true, category: true },
        orderBy: { createdAt: order },
        skip,
        take: limit,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: { jobs, results, admitCards, answerKeys },
      pagination: { page, limit },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    )
  }
}
