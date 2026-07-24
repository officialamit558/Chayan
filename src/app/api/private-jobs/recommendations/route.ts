import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { extractSkills, extractExperienceYears, extractEducationLevel, extractLocations, computeMatchScore, generateImprovementTips } from "@/lib/skills"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, data: [], message: "Login to get personalized recommendations" })
    }

    const resume = await prisma.resume.findUnique({
      where: { userId: session.user.id },
    })

    if (!resume) {
      return NextResponse.json({ success: true, data: [], message: "Upload your resume to get job recommendations" })
    }

    const resumeSkills = JSON.parse(resume.skills || "[]") as string[]
    const resumeExperience = parseInt(resume.experience || "0")
    const resumeEducation = resume.education || "unknown"
    const resumeLocations = extractLocations(resume.rawText)

    const jobs = await prisma.privateJob.findMany({
      where: { status: "ACTIVE" },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    })

    const recommendations = jobs.map(job => {
      const match = computeMatchScore(resumeSkills, resumeExperience, resumeEducation, resumeLocations, {
        title: job.title,
        description: job.description || "",
        category: job.category || "",
        location: job.location || "",
        experience: job.experience || "",
        salary: job.salary || "",
      })
      const tips = generateImprovementTips(match.score, match.matchedSkills, resumeSkills, {
        title: job.title,
        description: job.description || "",
        category: job.category || "",
        experience: job.experience || "",
        salary: job.salary || "",
      })
      return {
        id: job.id,
        title: job.title,
        slug: job.slug,
        type: job.type,
        category: job.category,
        location: job.location,
        salary: job.salary,
        experience: job.experience,
        company: job.company,
        status: job.status,
        createdAt: job.createdAt,
        matchScore: match.score,
        matchedSkills: match.matchedSkills,
        matchDetails: match.details,
        improvementTips: tips,
      }
    })

    recommendations.sort((a, b) => b.matchScore - a.matchScore)

    const topMatches = recommendations.filter(r => r.matchScore >= 50)
    const otherJobs = recommendations.filter(r => r.matchScore < 50)

    return NextResponse.json({
      success: true,
      data: {
        topMatches,
        otherJobs,
        resume: {
          skills: resumeSkills,
          experience: resumeExperience,
          education: resumeEducation,
        },
        totalJobs: recommendations.length,
        matchCount: topMatches.length,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to get recommendations" },
      { status: 500 }
    )
  }
}