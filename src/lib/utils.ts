import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import slugifyLib from "slugify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined, dateFormat: string = "dd MMM yyyy"): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  if (isNaN(d.getTime())) return ""
  return format(d, dateFormat)
}

export function formatSalary(salary: string | null | undefined): string {
  if (!salary) return "Not Disclosed"
  return salary
}

export function slugify(str: string): string {
  return slugifyLib(str, { lower: true, strict: true })
}

export function truncate(str: string | null | undefined, length: number = 100): string {
  if (!str) return ""
  if (str.length <= length) return str
  return str.substring(0, length).trim() + "..."
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "EXPIRED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "UPCOMING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://chayan.in").replace(/\/+$/, "")
}

export function generateSEO({
  title,
  description,
  url,
  image,
  publishedTime,
  type = "website",
}: {
  title: string
  description: string
  url?: string
  image?: string
  publishedTime?: string
  type?: "website" | "article"
}) {
  const siteUrl = getBaseUrl()
  const fullUrl = url ? `${siteUrl}${url.startsWith("/") ? url : `/${url}`}` : siteUrl
  const ogImage = image || `${siteUrl}/og.png`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Chayan",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type,
      publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: fullUrl },
  }
}

export function absoluteUrl(path: string): string {
  return `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`
}

export function createJsonLD<T>(data: T): string {
  return JSON.stringify(data)
}
