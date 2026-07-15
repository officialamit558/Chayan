import { FetcherSource, FetchResult, FetchedJob } from "./types"
import { govtJobsBlogSource } from "./sources/govtJobsBlog"
import { prisma } from "@/lib/prisma"
import { ensureDepartment, ensureCategory, ensureState, slugify, parseLastDate } from "./utils"

const sources: Record<string, FetcherSource> = {
  [govtJobsBlogSource.name]: govtJobsBlogSource,
}

export function getAvailableSources(): string[] {
  return Object.keys(sources)
}

export async function importFromSource(sourceName: string): Promise<FetchResult> {
  const source = sources[sourceName]
  if (!source) {
    return { source: sourceName, success: false, imported: 0, skipped: 0, errors: [`Unknown source: ${sourceName}`] }
  }

  const errors: string[] = []
  let imported = 0
  let skipped = 0

  try {
    const fetched = await source.fetch()

    for (const job of fetched) {
      try {
        const slug = slugify(job.title).slice(0, 100)
        const existing = await prisma.job.findUnique({ where: { slug } })
        if (existing) {
          skipped++
          continue
        }

        const departmentId = await ensureDepartment(job.organization || "General")
        const categoryId = await ensureCategory(job.organization || "General")
        const stateId = job.location ? await ensureState(job.location) : undefined
        const lastDate = job.lastDate ? parseLastDate(job.lastDate) : undefined

        await prisma.job.create({
          data: {
            title: job.title,
            slug,
            departmentId,
            categoryId,
            stateId,
            totalVacancies: job.totalVacancies,
            salary: job.salary,
            location: job.location,
            education: job.qualification,
            lastDate: lastDate,
            applyLink: job.notificationUrl || job.sourceUrl,
            officialNotification: job.notificationUrl,
            status: lastDate && lastDate < new Date() ? "EXPIRED" : "ACTIVE",
          },
        })
        imported++
      } catch (e) {
        errors.push(`Error importing "${job.title}": ${e instanceof Error ? e.message : "Unknown"}`)
      }
    }
  } catch (e) {
    errors.push(`Fetch error: ${e instanceof Error ? e.message : "Unknown"}`)
  }

  return { source: sourceName, success: errors.length === 0, imported, skipped, errors }
}

export async function importAllSources(): Promise<FetchResult[]> {
  const results: FetchResult[] = []
  for (const name of Object.keys(sources)) {
    results.push(await importFromSource(name))
  }
  return results
}
