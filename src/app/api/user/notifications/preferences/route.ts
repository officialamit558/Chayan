import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId: session.user.id },
    })

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId: session.user.id },
      })
    }

    return NextResponse.json({ success: true, data: prefs })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load preferences" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { jobAlerts, resultAlerts, admitCardAlerts } = body

    const prefs = await prisma.notificationPreference.upsert({
      where: { userId: session.user.id },
      update: {
        ...(typeof jobAlerts === "boolean" ? { jobAlerts } : {}),
        ...(typeof resultAlerts === "boolean" ? { resultAlerts } : {}),
        ...(typeof admitCardAlerts === "boolean" ? { admitCardAlerts } : {}),
      },
      create: {
        userId: session.user.id,
        jobAlerts: typeof jobAlerts === "boolean" ? jobAlerts : true,
        resultAlerts: typeof resultAlerts === "boolean" ? resultAlerts : true,
        admitCardAlerts: typeof admitCardAlerts === "boolean" ? admitCardAlerts : false,
      },
    })

    return NextResponse.json({ success: true, data: prefs })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to save preferences" },
      { status: 500 }
    )
  }
}
