import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AdSense Compliance Checklist",
  description: "Complete checklist for Google AdSense approval on Chayan. Review all requirements before applying.",
  robots: { index: false, follow: false },
}

const checklistItems = [
  {
    category: "Content Quality",
    items: [
      { label: "Minimum 20-30 high-quality pages with unique content", status: "done" },
      { label: "All pages have 500+ words of original content", status: "done" },
      { label: "No copied or scraped content (all from official sources with rewrites)", status: "done" },
      { label: "About Us page with clear site purpose", status: "done" },
      { label: "Contact Us page with email/phone/address", status: "done" },
    ],
  },
  {
    category: "Required Pages (Policies)",
    items: [
      { label: "Privacy Policy", status: "done" },
      { label: "Terms of Service", status: "done" },
      { label: "Disclaimer (no government affiliation)", status: "done" },
      { label: "Cookie Policy", status: "done" },
      { label: "Editorial Policy", status: "done" },
      { label: "Copyright Policy", status: "done" },
      { label: "DMCA Policy", status: "done" },
    ],
  },
  {
    category: "Technical Requirements",
    items: [
      { label: "Custom domain (chayanjobs.com) connected", status: "done" },
      { label: "SSL/HTTPS active (Cloudflare)", status: "done" },
      { label: "Mobile-responsive design", status: "done" },
      { label: "Fast loading speed (Vercel Edge)", status: "done" },
      { label: "XML sitemap submitted to Google", status: "done" },
      { label: "robots.txt properly configured", status: "done" },
      { label: "No broken links or 404 errors", status: "pending" },
    ],
  },
  {
    category: "User Experience",
    items: [
      { label: "Easy navigation and clear site structure", status: "done" },
      { label: "No pop-ups or intrusive interstitials", status: "done" },
      { label: "Cookie consent banner implemented", status: "done" },
      { label: "No excessive ads or ad clutter", status: "done" },
      { label: "No misleading or deceptive content", status: "done" },
    ],
  },
  {
    category: "Pre-Approval Steps",
    items: [
      { label: "Google Search Console verified", status: "done" },
      { label: "Site indexed in Google (check: site:chayanjobs.com)", status: "pending" },
      { label: "No manual actions or penalties", status: "done" },
      { label: "Site has been live for 2+ months", status: "pending" },
      { label: "Sufficient traffic (recommended 50+ visits/day)", status: "pending" },
    ],
  },
]

export default function AdSenseChecklistPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">AdSense Compliance Checklist</h1>
      <p className="mb-8 text-sm text-gray-500">
        Use this checklist to verify Chayan meets all Google AdSense requirements before applying.
      </p>

      <div className="mb-8 rounded-lg border border-teal-200 bg-teal-50 p-4">
        <p className="text-sm text-teal-800">
          <strong>Recommendation:</strong> Wait until the site has been live for at least 2-3 months with
          consistent traffic before applying to AdSense. The most common rejection reasons are:
          insufficient content, lack of essential pages, and site age less than 6 months.
        </p>
      </div>

      {checklistItems.map((section) => (
        <section key={section.category} className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">{section.category}</h2>
          <div className="space-y-2">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-3"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                    item.status === "done" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {item.status === "done" ? "✓" : "!"}
                </span>
                <div>
                  <p className="text-sm text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400">
                    {item.status === "done" ? "Completed" : "Needs attention"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <p className="text-sm text-gray-400">
        Last updated: July 15, 2026. Re-check before each AdSense application attempt.
      </p>
    </div>
  )
}
