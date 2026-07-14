import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/Providers"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { siteConfig } from "@/lib/constants"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Latest Government Jobs, Results, Admit Cards`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: ["government jobs", "sarkari jobs", "govt jobs", "jobs in india", "sarkari result", "upcoming jobs", "sarkari naukri", "govt job alert"],
  authors: [{ name: siteConfig.name }],
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: `${siteConfig.name} - Latest Government Jobs, Results, Admit Cards`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Latest Government Jobs, Results, Admit Cards`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: { canonical: siteConfig.url },
  verification: process.env.GOOGLE_SEARCH_CONSOLE_ID
    ? { google: process.env.GOOGLE_SEARCH_CONSOLE_ID }
    : undefined,
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/og.png`,
  sameAs: [siteConfig.links.twitter, siteConfig.links.facebook, siteConfig.links.youtube],
  description: siteConfig.description,
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
