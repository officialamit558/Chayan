const USER_AGENT = "Mozilla/5.0 (compatible; ChayanBot/1.0)"

export async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(15000) })
    if (!res.ok) return null
    return res.text()
  } catch {
    return null
  }
}

export function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(parseInt(c, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, c) => String.fromCharCode(parseInt(c, 16)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"").replace(/&#8211;/g, "-").replace(/&#8217;/g, "'")
    .replace(/&#038;/g, "&").replace(/&nbsp;/g, " ")
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n").replace(/<\/tr>/gi, "\n")
    .replace(/<\/th>/gi, " ").replace(/<\/td>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&[^;]+;/g, decodeEntities)
    .replace(/\t/g, " ")
    .split("\n").map(l => l.trim()).join("\n")
}

export function extractJobLinks(html: string): { title: string; url: string }[] {
  const skipPathPrefixes = [
    "/latest-jobs/", "/admit-card/", "/result/", "/admission/",
    "/syllabus/", "/answer-key/", "/contact/", "/privacy-policy/",
    "/disclaimer/", "/latest-posts/", "/sarkari-result-",
  ]
  const skipTitlePrefixes = [
    "Skip to content", "Home", "Latest Job", "Admit Card", "Result",
    "Admission", "Syllabus", "Answer Key", "Contact Us", "Privacy Policy",
    "Disclaimer", "Sarkari Result", "SarkariResult", "Connect With Us",
    "Download SarkariResult", "Let", "Let\u2019s", "Search",
  ]

  const links: { title: string; url: string }[] = []
  const seen = new Set<string>()
  const regex = /<a\s+href="(https?:\/\/sarkariresult\.com\.cm[^"]+)"[^>]*>([^<]+)<\/a>/gi
  let match

  while ((match = regex.exec(html)) !== null) {
    const url = match[1].replace(/^http:/, "https:")
    const rawTitle = match[2].trim()
    const title = decodeEntities(rawTitle).trim()
    const path = new URL(url).pathname

    const isSkippedPath = skipPathPrefixes.some(p => path === p || path.startsWith(p))
    const isSkippedTitle = skipTitlePrefixes.some(p => title.startsWith(p))

    if (isSkippedPath || isSkippedTitle) continue
    if (title.length < 10) continue
    if (seen.has(url)) continue
    if (/\d{4}/.test(title) === false) continue

    seen.add(url)
    links.push({ title, url })
  }

  return links
}

export function extractTextBetween(text: string, startMarker: string, endMarkers: string[]): string {
  const startIdx = text.indexOf(startMarker)
  if (startIdx === -1) return ""
  let endIdx = text.length
  for (const marker of endMarkers) {
    const idx = text.indexOf(marker, startIdx + startMarker.length)
    if (idx !== -1 && idx < endIdx) endIdx = idx
  }
  return text.substring(startIdx + startMarker.length, endIdx).trim()
}

export function extractSectionLines(text: string, sectionHeader: string): string[] {
  const endMarkers = [
    "Important Dates", "Application Fee", "Age Limits", "Total Post",
    "Vacancy Details", "Education Qualification", "How To Fill", "How To Apply",
    "Mode Of Selection", "SOME USEFUL IMPORTANT LINKS", "Section Wise Syllabus",
    "Important Question", "You May Also Check", "Related Posts",
    "Join Our WhatsApp", "Download English Vocab",
  ].filter(h => h !== sectionHeader)
  const content = extractTextBetween(text, sectionHeader, endMarkers)
  if (!content) return []
  return content.split("\n").map(l => l.trim()).filter(Boolean)
}

export function parseTitle(text: string): string {
  return text.split("\n").map(l => l.trim()).filter(l => l.length > 0)[0] || ""
}

export function parseDescription(text: string): string {
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

export function parseOrganization(desc: string): string {
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

export function parseCategoryAndState(title: string, desc: string): { category?: string; state?: string } {
  const lowerTitle = title.toLowerCase()
  const lowerDesc = desc.toLowerCase()

  const catPatterns: [RegExp, string][] = [
    [/(railway|rrb)/, "Railway"],
    [/(bank|ibps|sbi|rbi|nabard)/, "Banking"],
    [/(upsc|central)/, "Central Government"],
    [/(state|psc|ssc|rssb|bpsc|mppsc|uppsc|cgpsc|ukpsc)/, "State Government"],
    [/(defence|army|navy|airforce|air force)/, "Defence"],
    [/(teaching|teacher|professor|utet|ctet|stet)/, "Teaching"],
    [/(medical|nursing|doctor|ayush|neet)/, "Medical"],
    [/(police|constable|si|guard)/, "Police"],
    [/(psu|iocl|hpcl|bhel|ntpc|ongc|coal|nlc|power)/, "PSU"],
  ]
  for (const [pattern, cat] of catPatterns) {
    if (pattern.test(lowerTitle) || pattern.test(lowerDesc)) return { category: cat, state: undefined }
  }

  const statePatterns: [RegExp, string][] = [
    [/(andhra pradesh|telangana|maharashtra|karnataka|tamil\s*nadu)/i, "Andhra Pradesh"],
    [/(kerala|gujarat|rajasthan|bihar|west bengal|odisha|orissa)/i, "Rajasthan"],
    [/(assam|punjab|haryana|delhi|jharkhand|chhattisgarh|goa)/i, "Delhi"],
    [/(uttarakhand|himachal|jammu|kashmir)/i, "Uttarakhand"],
    [/up\b|uttar pradesh/i, "Uttar Pradesh"],
    [/mp\b|madhya pradesh/i, "Madhya Pradesh"],
  ]
  for (const [pattern, state] of statePatterns) {
    if (pattern.test(lowerTitle) || pattern.test(lowerDesc)) return { category: "State Government", state }
  }
  return { category: undefined, state: undefined }
}

export function parseLocation(org: string, state?: string): string | undefined {
  if (state) return state
  const orgLower = org.toLowerCase()
  const cityMatch = org.match(/(?:^|\s)(Delhi|Mumbai|Kolkata|Chennai|Bangalore|Hyderabad|Pune|Ahmedabad|Lucknow|Patna|Bhopal|Chandigarh)/i)
  if (cityMatch) return cityMatch[1]
  if (orgLower.includes("delhi") || orgLower.includes("dsssb")) return "Delhi"
  if (orgLower.includes("mumbai") || orgLower.includes("maharashtra")) return "Maharashtra"
  return undefined
}

export function parseImportantDates(lines: string[]): { startDate?: string; lastDate?: string; examDate?: string; resultDate?: string; importantDates?: Record<string, string> } {
  const result: Record<string, string> = {}
  let startDate: string | undefined
  let lastDate: string | undefined
  let examDate: string | undefined
  let resultDate: string | undefined

  for (const line of lines) {
    const m = line.match(/^([^:]+?)\s*:\s*(.+)$/)
    if (m) {
      const key = m[1].trim()
      const val = m[2].trim()
      result[key] = val
      if (/start/i.test(key)) startDate = val
      if (/last date/i.test(key) && !/fee/i.test(key)) lastDate = val
      if (/exam date/i.test(key)) examDate = val
      if (/result date/i.test(key)) resultDate = val
    }
  }

  return {
    startDate, lastDate, examDate, resultDate,
    importantDates: Object.keys(result).length > 0 ? result : undefined,
  }
}

export function parseApplicationFee(lines: string[]): string | undefined {
  return lines.length > 0 ? lines.join("\n") : undefined
}

export function parseTotalVacancies(text: string): number | undefined {
  const m = text.match(/(\d[\d,]*)\s*\+?\s*(?:Posts?|Vacanc\w+|Position)/i)
  if (m) return parseInt(m[1].replace(/,/g, ""), 10)
  return undefined
}

export function parseSalary(text: string): string | undefined {
  const m = text.match(/(?:Salary|Pay Scale|Pay Level|Remuneration)\s*:?\s*[₹Rs.]*\s*([\d,]+\s*(?:to|-)\s*[₹Rs.]*[\d,]+|[₹Rs.]*\s*[\d,]+)/i)
  return m ? m[1].trim() : undefined
}

export function parseAgeLimit(lines: string[]): { ageLimit?: string; ageRelaxation?: string } {
  let minAge = "", maxAge = ""
  const relaxLines: string[] = []
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (lower.includes("minimum age") || lower.includes("min age")) minAge = line.replace(/^[^:]*:\s*/, "")
    else if (lower.includes("maximum age") || lower.includes("max age")) maxAge = line.replace(/^[^:]*:\s*/, "")
    else if (lower.includes("relaxation")) relaxLines.push(line)
  }
  const ageLimit = minAge || maxAge ? `Min: ${minAge}, Max: ${maxAge}`.replace(/^Min: , /, "").replace(/, Max: $/, "") : undefined
  return { ageLimit, ageRelaxation: relaxLines.length > 0 ? relaxLines.join("\n") : undefined }
}

export function parseSelectionProcess(lines: string[]): string | undefined {
  if (lines.length === 0 || (lines.length === 1 && lines[0].length < 5)) return undefined
  return lines.join("\n")
}

export function parseEducation(text: string): string | undefined {
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
  return undefined
}

export function parseHowToApply(text: string): string | undefined {
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

export function parseImportantLinks(text: string): { applyLink?: string; notificationUrl?: string; officialWebsite?: string; downloadUrl?: string; syllabusUrl?: string } {
  const section = extractTextBetween(text, "SOME USEFUL IMPORTANT LINKS", [
    "Important Question", "Join Our WhatsApp", "You May Also Check", "Related Posts",
    "Download English Vocab",
  ])

  const result: { applyLink?: string; notificationUrl?: string; officialWebsite?: string; downloadUrl?: string; syllabusUrl?: string } = {}

  if (section) {
    const lines = section.split("\n").map(l => l.trim()).filter(Boolean)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lower = line.toLowerCase()

      if (lower.includes("apply online") || lower.includes("apply link") || lower.includes("registration") || lower.includes("login")) {
        result.applyLink = extractUrlFromLines(lines, i)
      } else if (lower.includes("notification") || lower.includes("short notice")) {
        result.notificationUrl = extractUrlFromLines(lines, i)
      } else if (lower.includes("official website") || lower.includes("official site")) {
        result.officialWebsite = extractUrlFromLines(lines, i)
      } else if (lower.includes("admit card") || lower.includes("download")) {
        result.downloadUrl = extractUrlFromLines(lines, i)
      } else if (lower.includes("syllabus") || lower.includes("exam pattern")) {
        result.syllabusUrl = extractUrlFromLines(lines, i)
      }
    }
  }

  return result
}

function extractUrlFromLines(lines: string[], currentIdx: number): string | undefined {
  for (let j = currentIdx + 1; j < Math.min(currentIdx + 5, lines.length); j++) {
    const urlMatch = lines[j].match(/(https?:\/\/[^\s]+)/)
    if (urlMatch) return urlMatch[1]
  }
  const m = lines.slice(currentIdx, currentIdx + 3).join(" ").match(/(https?:\/\/[^\s]+)/)
  return m ? m[1] : undefined
}

export function parseAdvertisementNo(text: string): string | undefined {
  const m = text.match(/\(([^)]*(?:CEN|Advt|Advertisement|Advt\s*No)[^)]*)\)/i)
  if (m) return m[1].trim()
  const m2 = text.match(/(CEN\s*[-–]\s*[\d/]+\s*\d{4})/i)
  if (m2) return m2[1].trim()
  return undefined
}

export function parseSubjects(text: string): string | undefined {
  const section = extractTextBetween(text, "Section Wise Syllabus", [
    "Mode Of Selection", "SOME USEFUL IMPORTANT LINKS", "You May Also Check", "Important Question",
  ])
  if (!section) return undefined
  const lines = section.split("\n").map(l => l.trim()).filter(l => l.length > 0)
  const subjects = lines.filter(l =>
    !l.startsWith("UP Police") && !l.startsWith("Download") && !l.startsWith("Sarkari") && !l.startsWith("Related")
  )
  return subjects.length > 0 ? subjects.join("\n") : undefined
}
