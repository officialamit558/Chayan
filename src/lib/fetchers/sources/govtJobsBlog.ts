import { FetcherSource, FetchedJob } from "../types"

function extractTag(text: string, tag: string): string {
  const match = text.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`))
  return match ? match[1].trim() : ""
}

function extractAllTags(text: string, tag: string): string[] {
  const result: string[] = []
  const re = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "g")
  let m
  while ((m = re.exec(text)) !== null) {
    result.push(m[1].trim())
  }
  return result
}

function extractCategoryNames(xml: string): string[] {
  const cats = extractAllTags(xml, "category")
  return cats.filter((c) => c && c !== "Govt Jobs" && c !== "Sarkari Naukri" && c !== "Freejobalert")
}

function identifyOrganization(categories: string[]): string {
  const skip = new Set([
    "10th Pass", "12th Pass", "8th Pass", "Graduates", "Post Graduates (PG)",
    "Engineering", "Diploma", "ITI", "Medical", "Female", "Male",
    "Central Government", "State", "Bank Jobs", "PSU", "No Exam Government Jobs",
    "Employment News", "Accounting", "Teacher", "Faculty", "IT", "Legal",
    "Sports Quota", "EX Servicemen", "PWD Govt Jobs", "Deputation",
    "Experienced", "Doctor", "Nursing", "Driver", "Watchman",
    "Stenographer", "Clerk", "Data Entry", "Anganwadi", "Apprenticeship",
    "Andhra Pradesh", "Telangana", "Maharashtra", "Karnataka", "Delhi",
    "MP", "UP", "West Bengal",
  ])
  for (const cat of categories) {
    if (!skip.has(cat) && cat.length > 2) return cat
  }
  return categories[0] || "General"
}

function identifyState(categories: string[]): string | undefined {
  const states = new Set([
    "Andhra Pradesh", "Telangana", "Maharashtra", "Karnataka", "Tamil Nadu",
    "Kerala", "Gujarat", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh",
    "Bihar", "West Bengal", "Odisha", "Assam", "Punjab", "Haryana",
    "Delhi", "Jharkhand", "Chhattisgarh", "Uttarakhand", "Himachal Pradesh",
    "Jammu and Kashmir", "Goa", "MP", "UP",
  ])
  for (const cat of categories) {
    if (states.has(cat)) return cat
    if (cat === "MP") return "Madhya Pradesh"
    if (cat === "UP") return "Uttar Pradesh"
  }
  return undefined
}

function identifyQualification(categories: string[]): string | undefined {
  const quals = new Set([
    "10th Pass", "12th Pass", "8th Pass", "Graduates", "Post Graduates (PG)",
    "Engineering", "Diploma", "ITI", "B.Sc", "M.Sc", "B.Com", "M.Com",
    "BA", "MBA", "MBBS", "B.Ed", "CA", "ANM", "GNM", "B.Pharma",
    "MCA", "BHMS", "BAMS", "BUMS", "BNYS", "LLB",
  ])
  for (const cat of categories) {
    if (quals.has(cat)) return cat
  }
  return undefined
}

function extractSalary(description: string): string | undefined {
  const match = description.match(/salary\s*(?:ranges?\s*(?:from)?\s*)?(?:₹|rs\.?)\s*([\d,]+)\s*(?:to\s*(?:₹|rs\.?)\s*([\d,]+))?/i)
  if (match) {
    if (match[2]) return `₹${match[1]} - ₹${match[2]}`
    return `₹${match[1]}`
  }
  return undefined
}

function extractVacancies(title: string): number | undefined {
  const match = title.match(/(\d{2,4})\s+(vacanc|post|open|position)/i)
  if (match) return parseInt(match[1], 10)
  return undefined
}

function extractLastDate(description: string): string | undefined {
  const patterns = [
    /(?:last date|before|deadline|apply\s*before)[:\s]*(\d{1,2}[-/]\s*\d{1,2}[-/]\d{4})/i,
    /(\d{1,2}[-/]\d{1,2}[-/]\d{4})\s*(?:is|\))/
  ]
  for (const pat of patterns) {
    const m = description.match(pat)
    if (m) return m[1]
  }
  return undefined
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

export const govtJobsBlogSource: FetcherSource = {
  name: "govtjobsblog.in",

  async fetch(): Promise<FetchedJob[]> {
    const res = await fetch("https://www.govtjobsblog.in/feed/", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ChayanBot/1.0)" },
    })
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
    const xml = await res.text()

    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []
    const jobs: FetchedJob[] = []

    for (const item of items) {
      try {
        const title = extractTag(item, "title")
        if (!title) continue

        const description = stripHtml(extractTag(item, "description")).slice(0, 500)
        const link = extractTag(item, "link")
        const pubDateStr = extractTag(item, "pubDate")
        const categories = extractCategoryNames(item)

        const organization = identifyOrganization(categories)
        const state = identifyState(categories)
        const qualification = identifyQualification(categories)
        const salary = extractSalary(description)
        const totalVacancies = extractVacancies(title)
        const lastDateText = extractLastDate(description)

        jobs.push({
          title: title.replace(/\s+/g, " ").trim(),
          organization,
          location: state || undefined,
          qualification: qualification || undefined,
          lastDate: lastDateText || undefined,
          salary,
          totalVacancies,
          notificationUrl: link || undefined,
          sourceUrl: link || "",
          publishedAt: pubDateStr ? new Date(pubDateStr) : new Date(),
        })
      } catch {
        continue
      }
    }

    return jobs
  },
}
