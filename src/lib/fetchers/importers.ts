import { prisma } from "@/lib/prisma"
import { slugify, ensureDepartment, ensureCategory, ensureState, parseLastDate } from "./utils"
import {
  fetchHtml, stripHtml, extractJobLinks, parseTitle, parseDescription,
  parseOrganization, parseCategoryAndState, parseLocation,
  parseImportantDates, parseApplicationFee, parseTotalVacancies,
  parseAgeLimit, parseSelectionProcess, parseEducation, parseHowToApply,
  parseImportantLinks, parseAdvertisementNo, parseSubjects, extractSectionLines,
} from "./sarkariShared"
import type { FetchResult, ImportConfig } from "./types"

const MAX_JOBS = 15

export const importConfigs: ImportConfig[] = [
  {
    id: "jobs",
    label: "Job Fetcher",
    description: "Government job notifications",
    listingUrl: "https://sarkariresult.com.cm/latest-jobs/",
    icon: "Briefcase",
  },
  {
    id: "admit-cards",
    label: "Admit Card Fetcher",
    description: "Admit card releases and exam dates",
    listingUrl: "https://sarkariresult.com.cm/admit-card/",
    icon: "IdCard",
  },
  {
    id: "results",
    label: "Result Fetcher",
    description: "Exam results and answer keys",
    listingUrl: "https://sarkariresult.com.cm/result/",
    icon: "FileText",
  },
  {
    id: "admissions",
    label: "Admission Fetcher",
    description: "Admission notifications and applications",
    listingUrl: "https://sarkariresult.com.cm/admission/",
    icon: "GraduationCap",
  },
  {
    id: "syllabus",
    label: "Syllabus Fetcher",
    description: "Exam syllabus and patterns",
    listingUrl: "https://sarkariresult.com.cm/syllabus/",
    icon: "Book",
  },
  {
    id: "answer-keys",
    label: "Answer Key Fetcher",
    description: "Exam answer keys and solutions",
    listingUrl: "https://sarkariresult.com.cm/answer-key/",
    icon: "Key",
  },
]

async function fetchAndParsePages(listingUrl: string, maxJobs = MAX_JOBS): Promise<{ text: string; url: string }[]> {
  const listingHtml = await fetchHtml(listingUrl)
  const jobLinks = extractJobLinks(listingHtml)
  const batch = jobLinks.slice(0, maxJobs)
  const pages: { text: string; url: string }[] = []

  for (const link of batch) {
    try {
      const html = await fetchHtml(link.url)
      const text = stripHtml(html)
      pages.push({ text, url: link.url })
    } catch (e) {
      console.error(`[fetcher] Failed to fetch ${link.url}:`, e)
    }
  }

  return pages
}

export async function importJobs(): Promise<FetchResult> {
  const errors: string[] = []
  let imported = 0, skipped = 0

  try {
    const pages = await fetchAndParsePages("https://sarkariresult.com.cm/latest-jobs/")

    for (const { text, url } of pages) {
      try {
        const title = parseTitle(text)
        if (!title) continue

        const slug = slugify(title).slice(0, 100)
        if (await prisma.job.findUnique({ where: { slug } })) { skipped++; continue }
        if (await prisma.job.findFirst({ where: { OR: [{ applyLink: url }, { officialNotification: url }] } })) { skipped++; continue }

        const desc = parseDescription(text)
        const org = parseOrganization(desc) || title
        const { category, state } = parseCategoryAndState(title, desc)
        const location = parseLocation(desc, state)
        const { startDate, lastDate, importantDates } = parseImportantDates(extractSectionLines(text, "Important Dates"))
        const applicationFee = parseApplicationFee(extractSectionLines(text, "Application Fee"))
        const ageData = parseAgeLimit(extractSectionLines(text, "Age Limits"))
        const totalLines = extractSectionLines(text, "Total Post")
        const totalVacancies = parseTotalVacancies(totalLines.join(" ")) || parseTotalVacancies(text)
        const selectionProcess = parseSelectionProcess(extractSectionLines(text, "Mode Of Selection"))
        const education = parseEducation(text)
        const howToApply = parseHowToApply(text)
        const links = parseImportantLinks(text)
        const advertisementNo = parseAdvertisementNo(text)

        const departmentId = await ensureDepartment(org)
        const categoryId = category ? await ensureCategory(category) : await ensureCategory(org)
        const stateId = state ? await ensureState(state) : location ? await ensureState(location) : undefined

        await prisma.job.create({
          data: {
            title, slug, departmentId, categoryId, stateId,
            advertisementNo: advertisementNo || undefined,
            totalVacancies: totalVacancies || undefined,
            salary: undefined, location: location || undefined,
            ageLimit: ageData.ageLimit || undefined,
            ageRelaxation: ageData.ageRelaxation || undefined,
            education: education || undefined,
            selectionProcess: selectionProcess || undefined,
            applicationFee: applicationFee || undefined,
            importantDates: importantDates || undefined,
            howToApply: howToApply || undefined,
            officialNotification: links.notificationUrl || url,
            officialWebsite: links.officialWebsite || undefined,
            applyLink: links.applyLink || url,
            startDate: startDate ? parseLastDateString(startDate) : undefined,
            lastDate: lastDate ? parseLastDateString(lastDate) : undefined,
            status: "ACTIVE",
          },
        })
        imported++
      } catch (e) {
        errors.push(`Job import error: ${e instanceof Error ? e.message : "Unknown"}`)
      }
    }
  } catch (e) {
    errors.push(`Fetch error: ${e instanceof Error ? e.message : "Unknown"}`)
  }

  return { source: "Jobs", success: errors.length === 0, imported, skipped, errors }
}

export async function importAdmitCards(): Promise<FetchResult> {
  const errors: string[] = []
  let imported = 0, skipped = 0

  try {
    const pages = await fetchAndParsePages("https://sarkariresult.com.cm/admit-card/")

    for (const { text, url } of pages) {
      try {
        const title = parseTitle(text)
        if (!title) continue

        const slug = slugify(title + "-admit-card").slice(0, 100)
        if (await prisma.admitCard.findUnique({ where: { slug } })) { skipped++; continue }
        if (await prisma.admitCard.findFirst({ where: { downloadUrl: url } })) { skipped++; continue }

        const desc = parseDescription(text)
        const org = parseOrganization(desc) || title
        const { category, state } = parseCategoryAndState(title, desc)
        const { examDate } = parseImportantDates(extractSectionLines(text, "Important Dates"))
        const links = parseImportantLinks(text)

        const departmentId = await ensureDepartment(org)
        const categoryId = category ? await ensureCategory(category) : await ensureCategory(org)

        await prisma.admitCard.create({
          data: {
            title, slug, departmentId, categoryId,
            description: desc || undefined,
            downloadUrl: links.downloadUrl || links.notificationUrl || url,
            examDate: examDate ? parseLastDateString(examDate) : undefined,
            status: "PUBLISHED",
          },
        })
        imported++
      } catch (e) {
        errors.push(`Admit card import error: ${e instanceof Error ? e.message : "Unknown"}`)
      }
    }
  } catch (e) {
    errors.push(`Fetch error: ${e instanceof Error ? e.message : "Unknown"}`)
  }

  return { source: "Admit Cards", success: errors.length === 0, imported, skipped, errors }
}

export async function importResults(): Promise<FetchResult> {
  const errors: string[] = []
  let imported = 0, skipped = 0

  try {
    const pages = await fetchAndParsePages("https://sarkariresult.com.cm/result/")

    for (const { text, url } of pages) {
      try {
        const title = parseTitle(text)
        if (!title) continue

        const slug = slugify(title + "-result").slice(0, 100)
        if (await prisma.result.findUnique({ where: { slug } })) { skipped++; continue }
        if (await prisma.result.findFirst({ where: { pdfUrl: url } })) { skipped++; continue }

        const desc = parseDescription(text)
        const org = parseOrganization(desc) || title
        const { category, state } = parseCategoryAndState(title, desc)
        const { resultDate } = parseImportantDates(extractSectionLines(text, "Important Dates"))
        const links = parseImportantLinks(text)

        const departmentId = await ensureDepartment(org)
        const categoryId = category ? await ensureCategory(category) : await ensureCategory(org)

        await prisma.result.create({
          data: {
            title, slug, departmentId, categoryId,
            description: desc || undefined,
            pdfUrl: links.notificationUrl || url,
            resultDate: resultDate ? parseLastDateString(resultDate) : undefined,
            status: "PUBLISHED",
          },
        })
        imported++
      } catch (e) {
        errors.push(`Result import error: ${e instanceof Error ? e.message : "Unknown"}`)
      }
    }
  } catch (e) {
    errors.push(`Fetch error: ${e instanceof Error ? e.message : "Unknown"}`)
  }

  return { source: "Results", success: errors.length === 0, imported, skipped, errors }
}

export async function importAdmissions(): Promise<FetchResult> {
  const errors: string[] = []
  let imported = 0, skipped = 0

  try {
    const pages = await fetchAndParsePages("https://sarkariresult.com.cm/admission/")

    for (const { text, url } of pages) {
      try {
        const title = parseTitle(text)
        if (!title) continue

        const slug = slugify(title + "-admission").slice(0, 100)
        if (await prisma.admission.findUnique({ where: { slug } })) { skipped++; continue }
        if (await prisma.admission.findFirst({ where: { pdfUrl: url } })) { skipped++; continue }

        const desc = parseDescription(text)
        const org = parseOrganization(desc) || title
        const { category, state } = parseCategoryAndState(title, desc)
        const { startDate, lastDate } = parseImportantDates(extractSectionLines(text, "Important Dates"))
        const applicationFee = parseApplicationFee(extractSectionLines(text, "Application Fee"))
        const links = parseImportantLinks(text)

        const departmentId = await ensureDepartment(org)
        const categoryId = category ? await ensureCategory(category) : await ensureCategory(org)

        await prisma.admission.create({
          data: {
            title, slug, departmentId, categoryId,
            description: desc || undefined,
            startDate: startDate ? parseLastDateString(startDate) : undefined,
            lastDate: lastDate ? parseLastDateString(lastDate) : undefined,
            applicationFee: applicationFee || undefined,
            pdfUrl: links.notificationUrl || url,
            status: "PUBLISHED",
          },
        })
        imported++
      } catch (e) {
        errors.push(`Admission import error: ${e instanceof Error ? e.message : "Unknown"}`)
      }
    }
  } catch (e) {
    errors.push(`Fetch error: ${e instanceof Error ? e.message : "Unknown"}`)
  }

  return { source: "Admissions", success: errors.length === 0, imported, skipped, errors }
}

export async function importSyllabus(): Promise<FetchResult> {
  const errors: string[] = []
  let imported = 0, skipped = 0

  try {
    const pages = await fetchAndParsePages("https://sarkariresult.com.cm/syllabus/")

    for (const { text, url } of pages) {
      try {
        const title = parseTitle(text)
        if (!title) continue

        const slug = slugify(title + "-syllabus").slice(0, 100)
        if (await prisma.syllabus.findUnique({ where: { slug } })) { skipped++; continue }
        if (await prisma.syllabus.findFirst({ where: { pdfUrl: url } })) { skipped++; continue }

        const desc = parseDescription(text)
        const org = parseOrganization(desc) || title
        const { category, state } = parseCategoryAndState(title, desc)
        const subjects = parseSubjects(text)
        const links = parseImportantLinks(text)

        const departmentId = await ensureDepartment(org)
        const categoryId = category ? await ensureCategory(category) : await ensureCategory(org)

        await prisma.syllabus.create({
          data: {
            title, slug, departmentId, categoryId,
            description: desc || undefined,
            subjects: subjects || undefined,
            pdfUrl: links.syllabusUrl || links.notificationUrl || url,
            status: "PUBLISHED",
          },
        })
        imported++
      } catch (e) {
        errors.push(`Syllabus import error: ${e instanceof Error ? e.message : "Unknown"}`)
      }
    }
  } catch (e) {
    errors.push(`Fetch error: ${e instanceof Error ? e.message : "Unknown"}`)
  }

  return { source: "Syllabus", success: errors.length === 0, imported, skipped, errors }
}

export async function importAnswerKeys(): Promise<FetchResult> {
  const errors: string[] = []
  let imported = 0, skipped = 0

  try {
    const pages = await fetchAndParsePages("https://sarkariresult.com.cm/answer-key/")

    for (const { text, url } of pages) {
      try {
        const title = parseTitle(text)
        if (!title) continue

        const slug = slugify(title + "-answer-key").slice(0, 100)
        if (await prisma.answerKey.findUnique({ where: { slug } })) { skipped++; continue }
        if (await prisma.answerKey.findFirst({ where: { pdfUrl: url } })) { skipped++; continue }

        const desc = parseDescription(text)
        const org = parseOrganization(desc) || title
        const { category } = parseCategoryAndState(title, desc)
        const links = parseImportantLinks(text)

        const departmentId = await ensureDepartment(org)
        const categoryId = category ? await ensureCategory(category) : await ensureCategory(org)

        await prisma.answerKey.create({
          data: {
            title, slug, departmentId, categoryId,
            description: desc || undefined,
            pdfUrl: links.notificationUrl || url,
            status: "PUBLISHED",
          },
        })
        imported++
      } catch (e) {
        errors.push(`Answer key import error: ${e instanceof Error ? e.message : "Unknown"}`)
      }
    }
  } catch (e) {
    errors.push(`Fetch error: ${e instanceof Error ? e.message : "Unknown"}`)
  }

  return { source: "Answer Keys", success: errors.length === 0, imported, skipped, errors }
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
