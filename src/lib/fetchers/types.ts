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
