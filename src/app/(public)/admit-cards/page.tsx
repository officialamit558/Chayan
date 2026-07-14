import type { Metadata } from "next"
import { AdmitCardsClient } from "./admit-cards-client"

export const metadata: Metadata = {
  title: "Admit Cards",
  description: "Download admit cards for upcoming government exams. Get hall tickets for various government job examinations across India.",
}

export const dynamic = "force-dynamic"

export default function AdmitCardsPage() {
  return <AdmitCardsClient />
}
