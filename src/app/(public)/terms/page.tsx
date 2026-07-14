import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Chayan. Please read these terms carefully before using our website.",
  openGraph: {
    title: "Terms of Service - Chayan",
    description: "Review the terms and conditions governing the use of Chayan.",
  },
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">Terms of Service</h1>
      <p className="mb-8 text-sm text-gray-500">Last updated: July 1, 2026</p>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Acceptance of Terms</h2>
        <p className="leading-relaxed text-gray-700">
          By accessing or using Chayan, you agree to be bound by these Terms of Service. If you do
          not agree with any part of these terms, please do not use our website. We reserve the right to
          update these terms at any time without prior notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Use License</h2>
        <p className="mb-3 leading-relaxed text-gray-700">
          Permission is granted to temporarily access and view the materials on Chayan for
          personal, non-commercial use only. This is the grant of a license, not a transfer of title.
        </p>
        <p className="leading-relaxed text-gray-700">
          Under this license you may not modify, copy, reproduce, republish, upload, post, transmit,
          or distribute any content from our website without prior written permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Disclaimer</h2>
        <p className="mb-3 leading-relaxed text-gray-700">
          The materials on Chayan are provided on an &quot;as is&quot; basis. We make no warranties,
          expressed or implied, and hereby disclaim and negate all other warranties including, without
          limitation, implied warranties or conditions of merchantability, fitness for a particular
          purpose, or non-infringement of intellectual property.
        </p>
        <p className="leading-relaxed text-gray-700">
          We do not warrant that the information on this website is accurate, complete, or current. We
          may change the content at any time without notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Limitations</h2>
        <p className="leading-relaxed text-gray-700">
          In no event shall Chayan or its suppliers be liable for any damages (including, without
          limitation, damages for loss of data or profit, or due to business interruption) arising out of
          the use or inability to use the materials on our website, even if we have been notified orally or
          in writing of the possibility of such damage.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Accuracy of Information</h2>
        <p className="leading-relaxed text-gray-700">
          While we strive to keep all information accurate and up-to-date, we make no representations or
          warranties of any kind about the completeness, accuracy, reliability, suitability, or
          availability of the information on our website. Users are advised to verify all details on the
          respective official websites before applying for any position.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Links to Other Websites</h2>
        <p className="leading-relaxed text-gray-700">
          Our website may contain links to third-party websites or services that are not owned or
          controlled by Chayan. We have no control over, and assume no responsibility for, the
          content, privacy policies, or practices of any third-party websites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Modifications</h2>
        <p className="leading-relaxed text-gray-700">
          We reserve the right to revise these terms of service at any time without notice. By using this
          website, you agree to be bound by the current version of these terms of service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Contact</h2>
        <p className="leading-relaxed text-gray-700">
          If you have any questions about these terms, please{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
        </p>
      </section>
    </div>
  )
}
