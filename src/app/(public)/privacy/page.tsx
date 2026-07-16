import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy of Chayan. Learn about how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy - Chayan",
    description: "Understand how Chayan handles your data and protects your privacy.",
  },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mb-8 text-sm text-gray-500">Last updated: July 1, 2026</p>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Information We Collect</h2>
        <p className="mb-3 leading-relaxed text-gray-700">
          When you visit Chayan, we may collect certain information automatically, including your
          IP address, browser type, operating system, referring URLs, and your interactions with our site.
          If you subscribe to our newsletter or contact us via email, we collect the personal information
          you provide, such as your name and email address.
        </p>
        <p className="leading-relaxed text-gray-700">
          We do not collect sensitive personal data unless you voluntarily provide it. We never collect
          financial information such as bank account details, credit card numbers, or UPI identifiers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
        <p className="mb-3 leading-relaxed text-gray-700">
          The information we collect is used to improve our services, personalize your experience, send
          job alerts and newsletters (only with your consent), and respond to your inquiries.
        </p>
        <p className="leading-relaxed text-gray-700">
          We do not sell, trade, or rent your personal information to third parties. We may share
          aggregated, non-personally identifiable information for analytics and reporting purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Cookies</h2>
        <p className="mb-3 leading-relaxed text-gray-700">
          Chayan uses cookies and similar tracking technologies to enhance your browsing experience,
          analyze site traffic, and understand where our visitors come from. Cookies are small text files
          stored on your device by your web browser.
        </p>
        <p className="leading-relaxed text-gray-700">
          You can control cookie preferences through your browser settings. Disabling cookies may affect
          certain features of our website. We use both session cookies (which expire when you close your
          browser) and persistent cookies (which remain until deleted).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Third-Party Links</h2>
        <p className="mb-3 leading-relaxed text-gray-700">
          Our website contains links to external third-party websites, including official government
          portals, examination bodies, and news sources. We are not responsible for the privacy practices
          or content of these external sites.
        </p>
        <p className="leading-relaxed text-gray-700">
          We encourage you to review the privacy policies of any third-party sites you visit. The
          inclusion of a link does not imply endorsement by Chayan.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Data Security</h2>
        <p className="mb-3 leading-relaxed text-gray-700">
          We implement reasonable technical and organizational measures to protect your personal
          information against unauthorized access, alteration, disclosure, or destruction.
        </p>
        <p className="leading-relaxed text-gray-700">
          However, no method of transmission over the Internet or electronic storage is 100% secure.
          While we strive to protect your data, we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Contact</h2>
        <p className="leading-relaxed text-gray-700">
          If you have any questions about this Privacy Policy, please{" "}
          <Link href="/contact" className="text-teal-600 hover:underline">contact us</Link>.
        </p>
      </section>
    </div>
  )
}
