import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Chayan - India's trusted platform for government job notifications, exam results, admit cards, and career resources.",
  openGraph: {
    title: "About Chayan",
    description: "Learn about India's trusted government job portal connecting millions with Sarkari career opportunities.",
  },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">About Chayan</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Who We Are</h2>
        <p className="mb-4 leading-relaxed text-gray-700">
          Chayan is a comprehensive online platform dedicated to providing the latest information on
          government job opportunities across India. We aggregate job notifications from various central and
          state government departments, public sector undertakings, and autonomous bodies to create a
          single, reliable source for Sarkari job seekers.
        </p>
        <p className="leading-relaxed text-gray-700">
          Founded with the mission to bridge the information gap between aspiring candidates and government
          recruitment agencies, we serve millions of users every month who rely on us for accurate and timely
          updates on job openings, exam results, admit cards, answer keys, and syllabus.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Our Mission</h2>
        <p className="mb-4 leading-relaxed text-gray-700">
          Our mission is to empower every Indian citizen with equal access to government employment
          opportunities. We strive to simplify the job search process by presenting clear, organized, and
          up-to-date information in a user-friendly format.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          <li>Provide timely and accurate government job notifications</li>
          <li>Simplify access to exam results, admit cards, and answer keys</li>
          <li>Offer comprehensive syllabus and preparation resources</li>
          <li>Ensure transparency by linking directly to official sources</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">What We Offer</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border bg-white p-5">
            <h3 className="mb-2 font-semibold text-gray-900">Job Notifications</h3>
            <p className="text-sm text-gray-600">Latest recruitment notifications from all major government departments and PSUs.</p>
          </div>
          <div className="rounded-lg border bg-white p-5">
            <h3 className="mb-2 font-semibold text-gray-900">Exam Results</h3>
            <p className="text-sm text-gray-600">Quick access to examination results with direct links to official merit lists.</p>
          </div>
          <div className="rounded-lg border bg-white p-5">
            <h3 className="mb-2 font-semibold text-gray-900">Admit Cards</h3>
            <p className="text-sm text-gray-600">Download links for hall tickets and admit cards as soon as they are released.</p>
          </div>
          <div className="rounded-lg border bg-white p-5">
            <h3 className="mb-2 font-semibold text-gray-900">Answer Keys</h3>
            <p className="text-sm text-gray-600">Official answer keys for conducted examinations to estimate your score.</p>
          </div>
          <div className="rounded-lg border bg-white p-5">
            <h3 className="mb-2 font-semibold text-gray-900">Syllabus</h3>
            <p className="text-sm text-gray-600">Detailed exam syllabus and preparation guides for competitive examinations.</p>
          </div>
          <div className="rounded-lg border bg-white p-5">
            <h3 className="mb-2 font-semibold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-600">Important announcements including exam dates, application deadlines, and changes.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Why Trust Us</h2>
        <p className="mb-4 leading-relaxed text-gray-700">
          We understand the importance of accurate information when it comes to your career. Every
          notification published on our platform is verified against official government sources including
          departmental websites and the Employment News. We do not create or modify job listings — we
          simply aggregate and organize publicly available information for your convenience.
        </p>
        <p className="leading-relaxed text-gray-700">
          Our team continuously monitors official sources to ensure that you never miss an important update.
          We clearly mark the source of every notification so you can always verify details on the official
          website before applying.
        </p>
      </section>

      <div className="rounded-lg bg-teal-50 p-6 text-center">
        <p className="mb-3 text-gray-700">
          Have questions or feedback? We would love to hear from you.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}
