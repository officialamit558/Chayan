import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Copyright Policy",
  description: "Copyright Policy of Chayan. Information about intellectual property rights and content usage.",
  openGraph: {
    title: "Copyright Policy - Chayan",
    description: "Learn about copyright and content usage on Chayan.",
  },
}

export default function CopyrightPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">Copyright Policy</h1>
      <p className="mb-8 text-sm text-gray-500">Last updated: July 15, 2026</p>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Our Copyright</h2>
        <p className="leading-relaxed text-gray-700">
          All original content published on Chayan — including articles, compilations, layouts, graphics,
          logos, and design elements — is the intellectual property of Chayan unless otherwise stated.
          This content is protected under applicable copyright laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Publicly Available Information</h2>
        <p className="leading-relaxed text-gray-700">
          Chayan aggregates and republishes publicly available information from official government sources,
          including job notifications, exam results, admit cards, and answer keys. Such content is in the
          public domain or is published in the public interest. We provide proper attribution and links to
          the original government sources wherever possible.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Content Usage</h2>
        <p className="mb-3 leading-relaxed text-gray-700">
          You may:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          <li>View, read, and share our content for personal, non-commercial purposes</li>
          <li>Link to our pages from your website or social media</li>
          <li>Quote short excerpts with proper attribution and a link back to the original page</li>
        </ul>
        <p className="mb-3 mt-4 leading-relaxed text-gray-700">
          You may NOT:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          <li>Reproduce, republish, or distribute substantial portions of our content without prior written permission</li>
          <li>Use our content for commercial purposes without authorization</li>
          <li>Modify or create derivative works based on our original content</li>
          <li>Copy our design, layout, or branding elements</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Third-Party Content</h2>
        <p className="leading-relaxed text-gray-700">
          Our website may contain content from third parties, including images, articles, and embedded media.
          Such content remains the property of their respective owners. Chayan does not claim ownership of
          third-party content and will remove it upon valid request from the copyright holder.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Reporting Copyright Infringement</h2>
        <p className="leading-relaxed text-gray-700">
          If you believe that your copyrighted work has been used on Chayan in a way that constitutes
          copyright infringement, please refer to our{" "}
          <Link href="/dmca" className="text-blue-600 hover:underline">DMCA Policy</Link> for instructions
          on how to submit a takedown notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Contact</h2>
        <p className="leading-relaxed text-gray-700">
          If you have any questions about our Copyright Policy or wish to request permission to use our
          content, please{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
        </p>
      </section>
    </div>
  )
}
