import { FetcherSource, FetchResult, FetchedJob } from "./types"
import { sarkariResultSource } from "./sources/sarkariResult"
import { prisma } from "@/lib/prisma"
import { ensureDepartment, ensureCategory, ensureState, slugify, parseLastDate } from "./utils"

const sources: Record<string, FetcherSource> = {
  [sarkariResultSource.name]: sarkariResultSource,
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
        const existingBySlug = await prisma.job.findUnique({ where: { slug } })
        if (existingBySlug) {
          skipped++
          continue
        }

        const jobUrl = job.sourceUrl || job.notificationUrl
        if (jobUrl) {
          const existingByUrl = await prisma.job.findFirst({
            where: {
              OR: [
                { officialNotification: jobUrl },
                { applyLink: jobUrl },
              ],
            },
          })
          if (existingByUrl) {
            skipped++
            continue
          }
        }

        const departmentId = await ensureDepartment(job.organization || "General")
        const categoryId = job.category
          ? await ensureCategory(job.category)
          : await ensureCategory(job.organization || "General")
        const stateId = job.state ? await ensureState(job.state) : job.location ? await ensureState(job.location) : undefined
        const lastDate = job.lastDate ? parseLastDateString(job.lastDate) : undefined
        const startDate = job.startDate ? parseLastDateString(job.startDate) : undefined

        await prisma.job.create({
          data: {
            title: job.title,
            slug,
            departmentId,
            categoryId,
            stateId,
            advertisementNo: job.advertisementNo || undefined,
            totalVacancies: job.totalVacancies || undefined,
            salary: job.salary || undefined,
            location: job.location || undefined,
            ageLimit: job.ageLimit || undefined,
            ageRelaxation: job.ageRelaxation || undefined,
            education: job.education || job.qualification || undefined,
            selectionProcess: job.selectionProcess || undefined,
            applicationFee: job.applicationFee || undefined,
            importantDates: job.importantDates || undefined,
            documentsRequired: job.documentsRequired || undefined,
            howToApply: job.howToApply || undefined,
            officialNotification: job.notificationUrl || undefined,
            officialWebsite: job.officialWebsite || undefined,
            applyLink: job.applyLink || job.notificationUrl || job.sourceUrl,
            experience: job.experience || undefined,
            startDate,
            lastDate,
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

function parseLastDateString(text: string): Date | undefined {
  const months: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  }

  const m = text.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i)
  if (m) {
    const d = new Date(parseInt(m[3]), months[m[2].toLowerCase()], parseInt(m[1]))
    if (!isNaN(d.getTime())) return d
  }

  return parseLastDate(text)
}
