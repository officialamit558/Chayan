import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseResumeBuffer } from "@/lib/resume-parser"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Only PDF, DOCX, and TXT files are supported" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size must be under 5MB" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const parsed = await parseResumeBuffer(buffer, file.type)

    const resume = await prisma.resume.upsert({
      where: { userId: session.user.id },
      update: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        rawText: parsed.rawText,
        skills: JSON.stringify(parsed.skills),
        education: parsed.education,
        experience: String(parsed.experience),
      },
      create: {
        userId: session.user.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        rawText: parsed.rawText,
        skills: JSON.stringify(parsed.skills),
        education: parsed.education,
        experience: String(parsed.experience),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: resume.id,
        fileName: resume.fileName,
        skills: parsed.skills,
        experience: parsed.experience,
        education: parsed.education,
        locations: parsed.locations,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to process resume" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const resume = await prisma.resume.findUnique({
      where: { userId: session.user.id },
    })

    if (!resume) {
      return NextResponse.json({ success: true, data: null })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: resume.id,
        fileName: resume.fileName,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
        skills: JSON.parse(resume.skills || "[]"),
        education: resume.education,
        experience: resume.experience,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch resume" },
      { status: 500 }
    )
  }
}