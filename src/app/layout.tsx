import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/Providers"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Chayan - Latest Government Jobs, Results, Admit Cards",
    template: "%s | Chayan"
  },
  description: "select right. serve right. — Your trusted government job portal. Latest notifications, results, admit cards, answer keys and more.",
  keywords: ["government jobs", "sarkari jobs", "govt jobs", "jobs in india", "sarkari result", "upcoming jobs"],
  authors: [{ name: "Chayan" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Chayan"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
