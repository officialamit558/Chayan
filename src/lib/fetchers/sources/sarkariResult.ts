import { FetcherSource, FetchedJob } from "../types"

const LISTING_URL = "https://sarkariresult.com.cm/latest-jobs/"
const USER_AGENT = "Mozilla/5.0 (compatible; ChayanBot/1.0)"
const MAX_JOBS = 30

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.text()
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(parseInt(c, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, c) => String.fromCharCode(parseInt(c, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, "&")
    .replace(/&nbsp;/g, " ")
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/th>/gi, " ")
    .replace(/<\/td>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&[^;]+;/g, decodeEntities)
    .replace(/\t/g, " ")
    .split("\n")
    .map(l => l.trim())
    .join("\n")
}

function extractJobLinks(html: string): { title: string; url: string }[] {
  const skipPaths = new Set([
    "/", "/latest-jobs/", "/admit-card/", "/result/", "/admission/",
    "/syllabus/", "/answer-key/", "/contact/", "/privacy-policy/",
    "/disclaimer/", "/latest-posts/",
  ])
  const skipTitles = new Set([
    "Skip to content", "Home", "Latest Job", "Admit Card", "Result",
    "Admission", "Syllabus", "Answer Key", "Contact Us", "Privacy Policy",
    "Disclaimer", "Sarkari Result", "SarkariResult.com.cm",
    "Connect With Us", "Download SarkariResult App Now",
  ])

  const links: { title: string; url: string }[] = []
  const seen = new Set<string>()
  const regex = /<a\s+href="(https?:\/\/sarkariresult\.com\.cm[^"]+)"[^>]*>([^<]+)<\/a>/gi
  let match

  while ((match = regex.exec(html)) !== null) {
    let url = match[1].replace(/^http:/, "https:")
    const rawTitle = match[2].trim()
    const title = decodeEntities(rawTitle).trim()
    const path = new URL(url).pathname

    if (skipPaths.has(path)) continue
    if (skipTitles.has(title)) continue
    if (title.length < 10) continue
    if (seen.has(url)) continue

    seen.add(url)
    links.push({ title, url })
  }

  return links
}

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
}

function parseDate(text: string): Date | undefined {
  const m = text.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i)
  if (m) {
    const d = new Date(parseInt(m[3]), MONTHS[m[2].toLowerCase()], parseInt(m[1]))
    if (!isNaN(d.getTime())) return d
  }
  return undefined
}

function extractTextBetween(text: string, startMarker: string, endMarkers: string[]): string {
  const startIdx = text.indexOf(startMarker)
  if (startIdx === -1) return ""

  let endIdx = text.length
  for (const marker of endMarkers) {
    const idx = text.indexOf(marker, startIdx + startMarker.length)
    if (idx !== -1 && idx < endIdx) endIdx = idx
  }

  return text.substring(startIdx + startMarker.length, endIdx).trim()
}

function extractSectionLines(text: string, sectionHeader: string): string[] {
  const endMarkers = [
    "Important Dates", "Application Fee", "Age Limits", "Total Post",
    "Vacancy Details", "Education Qualification", "How To Fill", "How To Apply",
    "Mode Of Selection", "SOME USEFUL IMPORTANT LINKS",
    "Important Question", "You May Also Check", "Related Posts",
    "Join Our WhatsApp", "Download English Vocab",
  ].filter(h => h !== sectionHeader)

  const content = extractTextBetween(text, sectionHeader, endMarkers)
  if (!content) return []
  return content.split("\n").map(l => l.trim()).filter(Boolean)
}

function parseTitle(text: string): string {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0)
  return lines[0] || ""
}

function parseDescription(text: string): string {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean)
  const postDateIdx = lines.findIndex(l => l.startsWith("Post Date:"))
  if (postDateIdx === -1) return ""

  for (let i = postDateIdx + 1; i < lines.length; i++) {
    const l = lines[i]
    if (/^\d+:\d+\s*(am|pm)/i.test(l)) continue
    if (l.startsWith("Download")) continue
    if (l.length > 40) return l
  }
  return ""
}

function parseOrganization(desc: string): string {
  const patterns = [
    /(.+?)(?:,?\s+has released|\s+has released)/i,
    /(.+?)\s+(?:Department|Board|Commission|Corporation|Institute|Organization)/i,
  ]
  for (const pat of patterns) {
    const m = desc.match(pat)
    if (m) return m[1].trim()
  }
  return ""
}

function parseTotalVacancies(text: string): number | undefined {
  const m = text.match(/(\d[\d,]*)\s*\+?\s*(?:Posts?|Vacanc\w+|Position)/i)
  if (m) return parseInt(m[1].replace(/,/g, ""), 10)
  return undefined
}

function parseSalary(text: string): string | undefined {
  const m = text.match(/(?:Salary|Pay Scale|Pay Level|Remuneration)\s*:?\s*[₹Rs.]*\s*([\d,]+\s*(?:to|-)\s*[₹Rs.]*[\d,]+|[₹Rs.]*\s*[\d,]+)/i)
  if (m) return m[1].trim()
  return undefined
}

function parseImportantDates(lines: string[]): { startDate?: string; lastDate?: string; importantDates?: Record<string, string> } {
  const result: Record<string, string> = {}
  let startDate: string | undefined
  let lastDate: string | undefined

  for (const line of lines) {
    const m = line.match(/^([^:]+?)\s*:\s*(.+)$/)
    if (m) {
      const key = m[1].trim()
      const val = m[2].trim()
      result[key] = val

      if (/start/i.test(key) || /begin/i.test(key)) startDate = val
      if (/last date|last date for apply/i.test(key)) lastDate = val
    }
  }

  return { startDate, lastDate, importantDates: Object.keys(result).length > 0 ? result : undefined }
}

function parseApplicationFee(lines: string[]): string | undefined {
  if (lines.length === 0) return undefined
  return lines.join("\n")
}

function parseAgeLimit(lines: string[]): { ageLimit?: string; ageRelaxation?: string } {
  let minAge = ""
  let maxAge = ""
  const relaxLines: string[] = []

  for (const line of lines) {
    const lower = line.toLowerCase()
    if (lower.includes("minimum age") || lower.includes("min age")) {
      minAge = line.replace(/^[^:]*:\s*/, "")
    } else if (lower.includes("maximum age") || lower.includes("max age")) {
      maxAge = line.replace(/^[^:]*:\s*/, "")
    } else if (lower.includes("relaxation") || lower.includes("age relaxation")) {
      relaxLines.push(line)
    }
  }

  const ageLimit = minAge || maxAge ? `Min: ${minAge}, Max: ${maxAge}`.replace(/^Min: , /, "").replace(/, Max: $/, "") : undefined
  const ageRelaxation = relaxLines.length > 0 ? relaxLines.join("\n") : undefined

  return { ageLimit, ageRelaxation }
}

function parseSelectionProcess(lines: string[]): string | undefined {
  if (lines.length === 0) return undefined
  if (lines.length === 1 && lines[0].length < 5) return undefined
  return lines.join("\n")
}

function parseHowToApply(text: string): string | undefined {
  const headers = ["How To Fill", "How To Apply", "How to Apply"]
  for (const h of headers) {
    const content = extractTextBetween(text, h, [
      "Mode Of Selection", "SOME USEFUL IMPORTANT LINKS",
      "Important Question", "Join Our WhatsApp", "You May Also Check",
    ])
    if (content) {
      const cleaned = content.split("\n").map(l => l.trim()).filter(l => l.length > 5).join("\n")
      if (cleaned.length > 20) return cleaned
    }
  }
  return undefined
}

function parseEducation(text: string): string | undefined {
  const sections = ["Education Qualification", "Educational Qualification", "Eligibility Criteria"]
  for (const section of sections) {
    const content = extractTextBetween(text, section, [
      "How To Fill", "How To Apply", "Mode Of Selection",
      "SOME USEFUL IMPORTANT LINKS", "Important Question", "You May Also Check",
    ])
    if (content) {
      const cleaned = content.split("\n").map(l => l.trim()).filter(l => l.length > 5).join("\n")
      if (cleaned.length > 20) return cleaned
    }
  }

  const vacMatch = text.match(/Eligibility Criteria[^]*?(?:Candidates must have|Candidates who have)[^]*?(?=\n\n|\n[A-Z])/i)
  if (vacMatch) return vacMatch[0].trim()

  return undefined
}

function parseImportantLinks(text: string): { applyLink?: string; notificationUrl?: string; officialWebsite?: string } {
  const section = extractTextBetween(text, "SOME USEFUL IMPORTANT LINKS", [
    "Important Question", "Join Our WhatsApp", "You May Also Check", "Related Posts",
    "Download English Vocab",
  ])

  let applyLink: string | undefined
  let notificationUrl: string | undefined
  let officialWebsite: string | undefined

  if (section) {
    const lines = section.split("\n").map(l => l.trim()).filter(Boolean)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lower = line.toLowerCase()

      if (lower.includes("apply online") || lower.includes("apply link") || lower.includes("registration")) {
        const href = extractHrefFromClickHere(lines, i)
        if (href) applyLink = href
      } else if (lower.includes("notification") || lower.includes("short notice")) {
        const href = extractHrefFromClickHere(lines, i)
        if (href) notificationUrl = href
      } else if (lower.includes("official website") || lower.includes("official site")) {
        const href = extractHrefFromClickHere(lines, i)
        if (href) officialWebsite = href
      }
    }
  }

  return { applyLink, notificationUrl, officialWebsite }
}

function extractHrefFromClickHere(lines: string[], currentIdx: number): string | undefined {
  for (let j = currentIdx + 1; j < Math.min(currentIdx + 5, lines.length); j++) {
    const l = lines[j].toLowerCase()
    if (l.includes("click here")) {
      const urlMatch = lines[j].match(/https?:\/\/[^\s]+/)
      if (urlMatch) return urlMatch[0]
      const urlMatch2 = lines[j + 1]?.match(/https?:\/\/[^\s]+/)
      if (urlMatch2) return urlMatch2[0]
    }
  }

  const m = lines.slice(currentIdx, currentIdx + 3).join(" ").match(/(https?:\/\/[^\s]+)/)
  return m ? m[1] : undefined
}

function parseCategoryAndState(title: string, desc: string): { category?: string; state?: string } {
  const lowerTitle = title.toLowerCase()
  const lowerDesc = desc.toLowerCase()

  const categories: [RegExp, string][] = [
    [/(railway|rrb|rail)/, "Railway"],
    [/(bank|ibps|sbi|rbi|nabard)/, "Banking"],
    [/(upsc|central|centre)/, "Central Government"],
    [/(state|psc|ssc|rssb|bpsc|mppsc|uppsc|cgpsc|ukpsc)/, "State Government"],
    [/(defence|army|navy|airforce|air force)/, "Defence"],
    [/(teaching|teacher|professor|lecturer|utet|ctet|stet)/, "Teaching"],
    [/(medical|nursing|doctor|ayush|neet)/, "Medical"],
    [/(police|constable|si|guard)/, "Police"],
    [/(psu|iocl|hpcl|bhel|ntpc|ongc|coal|nlc|power)/, "PSU"],
  ]

  for (const [pattern, cat] of categories) {
    if (pattern.test(lowerTitle)) return { category: cat, state: undefined }
    if (pattern.test(lowerDesc)) return { category: cat, state: undefined }
  }

  const states: [RegExp, string][] = [
    [/(andhra pradesh|telangana|maharashtra|karnataka|tamil\s*nadu)/i, "Andhra Pradesh"],
    [/(kerala|gujarat|rajasthan|bihar|west bengal|odisha|orissa)/i, "Rajasthan"],
    [/(assam|punjab|haryana|delhi|jharkhand|chhattisgarh|goa)/i, "Delhi"],
    [/(uttarakhand|himachal|jammu|kashmir)/i, "Uttarakhand"],
    [/up\b|uttar pradesh/i, "Uttar Pradesh"],
    [/mp\b|madhya pradesh/i, "Madhya Pradesh"],
  ]

  for (const [pattern, state] of states) {
    if (pattern.test(lowerTitle)) return { category: "State Government", state }
    if (pattern.test(lowerDesc)) return { category: "State Government", state }
  }

  return { category: undefined, state: undefined }
}

function parseLocation(org: string, state?: string): string | undefined {
  if (state) return state
  const orgLower = org.toLowerCase()
  const cityMatch = org.match(/(?:^|\s)(Delhi|Mumbai|Kolkata|Chennai|Bangalore|Hyderabad|Pune|Ahmedabad|Lucknow|Patna|Bhopal|Chandigarh)/i)
  if (cityMatch) return cityMatch[1]
  if (orgLower.includes("delhi") || orgLower.includes("dsssb")) return "Delhi"
  if (orgLower.includes("mumbai") || orgLower.includes("maharashtra")) return "Maharashtra"
  return undefined
}

function parseAdvertisementNo(text: string): string | undefined {
  const m = text.match(/\(([^)]*(?:CEN|Advt|Advertisement|Advt\s*No)[^)]*)\)/i)
  if (m) return m[1].trim()

  const m2 = text.match(/(CEN\s*[-–]\s*[\d/]+\s*\d{4})/i)
  if (m2) return m2[1].trim()

  return undefined
}

function parseJobPage(text: string, url: string): FetchedJob | null {
  const title = parseTitle(text)
  if (!title) return null

  const desc = parseDescription(text)
  const org = parseOrganization(desc) || title
  const { category, state } = parseCategoryAndState(title, desc)
  const location = parseLocation(desc, state)
  const { startDate, lastDate, importantDates } = parseImportantDates(
    extractSectionLines(text, "Important Dates")
  )
  const applicationFee = parseApplicationFee(extractSectionLines(text, "Application Fee"))
  const { ageLimit, ageRelaxation } = parseAgeLimit(extractSectionLines(text, "Age Limits"))
  const totalPostLines = extractSectionLines(text, "Total Post")
  const totalVacancies = parseTotalVacancies(totalPostLines.join(" ")) || parseTotalVacancies(text)
  const selectionProcess = parseSelectionProcess(extractSectionLines(text, "Mode Of Selection"))
  const education = parseEducation(text)
  const howToApply = parseHowToApply(text)
  const { applyLink, notificationUrl, officialWebsite } = parseImportantLinks(text)
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
    applyLink: applyLink || url,
    notificationUrl: notificationUrl || url,
    officialWebsite,
    sourceUrl: url,
    publishedAt: new Date(),
    advertisementNo,
    ageLimit,
    ageRelaxation,
    selectionProcess,
    applicationFee,
    importantDates,
    documentsRequired: undefined,
    howToApply,
    experience: undefined,
    startDate,
  }
}

export const sarkariResultSource: FetcherSource = {
  name: "sarkariresult.com.cm",

  async fetch(): Promise<FetchedJob[]> {
    const listingHtml = await fetchHtml(LISTING_URL)
    const jobLinks = extractJobLinks(listingHtml)

    const batch = jobLinks.slice(0, MAX_JOBS)
    const jobs: FetchedJob[] = []

    for (const link of batch) {
      try {
        const html = await fetchHtml(link.url)
        const text = stripHtml(html)
        const job = parseJobPage(text, link.url)
        if (job) {
          jobs.push(job)
        }
      } catch (e) {
        console.error(`[sarkariResult] Failed to fetch ${link.url}:`, e)
      }
    }

    return jobs
  },
}
