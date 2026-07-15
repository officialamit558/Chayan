import { FetcherSource, FetchedJob } from "../types"
import {
  fetchHtml, stripHtml, extractJobLinks, parseTitle, parseDescription,
  parseOrganization, parseCategoryAndState, parseLocation,
  parseImportantDates, parseApplicationFee, parseTotalVacancies, parseSalary,
  parseAgeLimit, parseSelectionProcess, parseEducation, parseHowToApply,
  parseImportantLinks, parseAdvertisementNo, extractSectionLines,
} from "../sarkariShared"

const LISTING_URL = "https://sarkariresult.com.cm/latest-jobs/"
const MAX_JOBS = 15

function parseJobPage(text: string, url: string): FetchedJob | null {
  const title = parseTitle(text)
  if (!title) return null

  const desc = parseDescription(text)
  const org = parseOrganization(desc) || title
  const { category, state } = parseCategoryAndState(title, desc)
  const location = parseLocation(desc, state)
  const { startDate, lastDate, importantDates } = parseImportantDates(extractSectionLines(text, "Important Dates"))
  const applicationFee = parseApplicationFee(extractSectionLines(text, "Application Fee"))
  const { ageLimit, ageRelaxation } = parseAgeLimit(extractSectionLines(text, "Age Limits"))
  const totalPostLines = extractSectionLines(text, "Total Post")
  const totalVacancies = parseTotalVacancies(totalPostLines.join(" ")) || parseTotalVacancies(text)
  const selectionProcess = parseSelectionProcess(extractSectionLines(text, "Mode Of Selection"))
  const education = parseEducation(text)
  const howToApply = parseHowToApply(text)
  const links = parseImportantLinks(text)
  const advertisementNo = parseAdvertisementNo(text)

  return {
    title,
    organization: org,
    category,
    state,
    location,
    qualification: education,
    education,
    lastDate,
    salary: parseSalary(text),
    totalVacancies,
    applyLink: links.applyLink || url,
    notificationUrl: links.notificationUrl || url,
    officialWebsite: links.officialWebsite,
    sourceUrl: url,
    publishedAt: new Date(),
    advertisementNo,
    ageLimit,
    ageRelaxation,
    selectionProcess,
    applicationFee,
    importantDates,
    howToApply,
    startDate,
  }
}

export const sarkariJobsSource: FetcherSource = {
  name: "sarkariresult.com.cm - Jobs",

  async fetch(): Promise<FetchedJob[]> {
    const listingHtml = await fetchHtml(LISTING_URL)
    if (!listingHtml) return []

    const jobLinks = extractJobLinks(listingHtml)
    const batch = jobLinks.slice(0, MAX_JOBS)
    const jobs: FetchedJob[] = []

    for (const link of batch) {
      try {
        const html = await fetchHtml(link.url)
        if (!html) continue
        const text = stripHtml(html)
        const job = parseJobPage(text, link.url)
        if (job) jobs.push(job)
      } catch (e) {
        console.error(`[sarkariJobs] Failed to fetch ${link.url}:`, e)
      }
    }

    return jobs
  },
}
