import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Chayan. Reach out via email, phone, or postal address for queries, feedback, or support.",
  openGraph: {
    title: "Contact Chayan",
    description: "Have questions or feedback? Contact the Chayan team.",
  },
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">Contact Us</h1>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Get In Touch</h2>
            <p className="mb-6 leading-relaxed text-gray-700">
              We value your feedback and inquiries. Whether you have a question about our service, want to
              report an issue, or simply want to share your experience, we are here to help.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100">
                  <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <a href="mailto:contact@chayan.in" className="text-sm text-teal-600 hover:underline">
                    contact@chayan.in
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100">
                  <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <a href="tel:+911123456789" className="text-sm text-teal-600 hover:underline">
                    +91-11-23456789
                  </a>
                  <p className="text-xs text-gray-500">Monday to Friday, 10:00 AM - 6:00 PM IST</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100">
                  <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Address</h3>
                  <p className="text-sm text-gray-600">
                    Chayan<br />
                    42, Sector 14<br />
                    New Delhi - 110070<br />
                    India
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div>
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Send a Message</h2>
            <p className="mb-6 text-sm text-gray-600">
              Please email us directly at{" "}
              <a href="mailto:contact@chayan.in" className="text-teal-600 hover:underline">contact@chayan.in</a>
              {" "}for the fastest response. You can also use this form to draft your message.
            </p>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Write your message here..."
                />
              </div>
              <div className="rounded-md bg-yellow-50 p-3 text-xs text-yellow-800">
                This is a demo form. Please email us directly for a response.
              </div>
            </form>
          </section>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <Link href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
        {" "}—{" "}
        <Link href="/terms" className="text-teal-600 hover:underline">Terms of Service</Link>
      </div>
    </div>
  )
}
