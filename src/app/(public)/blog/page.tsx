import type { Metadata } from "next"
import { BlogClient } from "./blog-client"

export const metadata: Metadata = {
  title: "Blog - Exam Tips & Job Alerts",
  description: "Read expert tips, exam preparation guides, and latest government job updates on Chayan Blog.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://chayanjobs.com"}/blog` },
  twitter: { card: "summary_large_image", title: "Blog | Chayan", description: "Exam tips, preparation guides & job updates." },
}

export const dynamic = "force-dynamic"

export default function BlogPage() {
  return <BlogClient />
}
