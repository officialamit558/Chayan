export interface FetchedJob {
  title: string
  organization: string
  location?: string
  qualification?: string
  lastDate?: string
  salary?: string
  totalVacancies?: number
  applyLink?: string
  notificationUrl?: string
  sourceUrl: string
  publishedAt: Date
  category?: string
  state?: string
  advertisementNo?: string
  ageLimit?: string
  ageRelaxation?: string
  education?: string
  selectionProcess?: string
  applicationFee?: string
  importantDates?: Record<string, string>
  documentsRequired?: string
  howToApply?: string
  officialWebsite?: string
  experience?: string
  startDate?: string
}

export interface FetchResult {
  source: string
  success: boolean
  imported: number
  skipped: number
  errors: string[]
}

export interface FetcherSource {
  name: string
  fetch(): Promise<FetchedJob[]>
}
