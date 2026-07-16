import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for Chayan. Important information about our relationship with government organizations and the accuracy of content.",
  openGraph: {
    title: "Disclaimer - Chayan",
    description: "Read the disclaimer regarding our association with government bodies and information accuracy.",
  },
}

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold text-gray-900">Disclaimer</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">No Government Affiliation</h2>
        <p className="leading-relaxed text-gray-700">
          Chayan is a private informational website and is NOT affiliated with any government
          organization, ministry, department, or public sector undertaking. We are not a government
          entity, nor do we represent any official government body. Our platform simply aggregates
          publicly available information from official sources for the convenience of job seekers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Accuracy of Information</h2>
        <p className="mb-3 leading-relaxed text-gray-700">
          While we strive to ensure that all information on our website is accurate and up-to-date, we
          make no guarantees regarding the completeness, reliability, or timeliness of any content.
          Government recruitment notifications, exam dates, and application deadlines are subject to
          change at the discretion of the respective authorities.
        </p>
        <p className="leading-relaxed text-gray-700">
          Users are strongly advised to verify all details — including eligibility criteria, application
          fees, exam patterns, and important dates — on the official website of the concerned department
          or recruiting body before applying for any position.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">No Guarantee of Job Placement</h2>
        <p className="leading-relaxed text-gray-700">
          Chayan does not guarantee job placement, selection, or recruitment in any government
          organization. We provide information about vacancies and examinations only. The recruitment
          process, including shortlisting, examination, interview, and final selection, is solely the
          responsibility of the respective recruiting authority.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">No Fees Charged</h2>
        <p className="mb-3 leading-relaxed text-gray-700">
          Chayan does not charge any fees for job listings, application assistance, or exam
          registration. We do not ask for money, bank details, or any form of payment from job seekers.
          Beware of fraudulent individuals or entities claiming to represent Chayan and asking
          for payment in exchange for job placements or application processing.
        </p>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Important: If anyone contacts you on behalf of Chayan requesting payment, please
            report it to the local authorities immediately.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">External Links</h2>
        <p className="leading-relaxed text-gray-700">
          Our website contains links to external third-party websites for your convenience and reference.
          We do not endorse, control, or take responsibility for the content, privacy practices, or
          availability of these external sites. Users access these links at their own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Limitation of Liability</h2>
        <p className="leading-relaxed text-gray-700">
          Chayan, its owners, employees, or affiliates shall not be held liable for any direct,
          indirect, incidental, consequential, or punitive damages arising out of your access to, use of,
          or reliance on any information provided on this website. By using this site, you agree to
          indemnify and hold us harmless from any claims arising from your use of our content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900">Contact</h2>
        <p className="leading-relaxed text-gray-700">
          If you have any questions about this disclaimer, please{" "}
          <Link href="/contact" className="text-teal-600 hover:underline">contact us</Link>.
        </p>
      </section>
    </div>
  )
}
