import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [
      totalJobs,
      activeJobs,
      totalResults,
      totalUsers,
      totalCategories,
      totalDepartments,
      totalAdmitCards,
      totalAnswerKeys,
      recentJobs,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: "ACTIVE" } }),
      prisma.result.count(),
      prisma.user.count(),
      prisma.category.count(),
      prisma.department.count(),
      prisma.admitCard.count(),
      prisma.answerKey.count(),
      prisma.job.findMany({
        where: { status: "ACTIVE" },
        include: { department: true, category: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        totalResults,
        totalUsers,
        totalCategories,
        totalDepartments,
        totalAdmitCards,
        totalAnswerKeys,
        recentJobs,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
