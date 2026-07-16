"use client"

import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items?: FAQItem[]
  className?: string
}

const defaultItems: FAQItem[] = [
  {
    question: "What is the eligibility criteria for government jobs in India?",
    answer: "Eligibility criteria vary by job and department. Generally, candidates must be Indian citizens with specific educational qualifications (10th, 12th, graduate, postgraduate, etc.), age limits typically between 18-40 years (with relaxations for reserved categories), and sometimes physical standards for defence/police roles. Each notification specifies detailed eligibility requirements.",
  },
  {
    question: "How can I apply for government jobs online?",
    answer: "Most government job applications are submitted online through official websites of recruiting bodies like SSC (ssc.nic.in), UPSC (upsc.gov.in), Indian Railways (rrb.gov.in), IBPS (ibps.in), and state government portals. You need to register, fill the application form, upload documents, pay fees (if applicable), and submit before the deadline.",
  },
  {
    question: "What documents are required for government job applications?",
    answer: "Commonly required documents include: educational certificates, caste/category certificate, date of birth proof, domicile certificate, passport-size photographs, signature image, ID proof (Aadhaar, PAN, Voter ID), experience certificates (if required), and disability certificate (if applicable). All documents should be scanned in prescribed format and size.",
  },
  {
    question: "How are government job exam results published?",
    answer: "Results are published on the official websites of the respective recruiting bodies. They are usually released in PDF format containing roll numbers or names of selected candidates. You can check results on our portal or directly on official websites. Results are also sometimes published in leading newspapers.",
  },
  {
    question: "What is the application fee for government exams?",
    answer: "Application fees vary by exam and category. General/OBC candidates typically pay ₹100-₹500, while SC/ST/PWD/Women candidates often have reduced fees or full exemptions. Fees can be paid online via debit/credit card, net banking, or UPI. Some exams are completely free for all categories.",
  },
  {
    question: "How can I download my admit card for government exams?",
    answer: "Admit cards are uploaded on the official website of the conducting body before the exam date. You need to log in using your registration number and date of birth to download the hall ticket. We also provide direct download links on our Admit Cards page as soon as they are released.",
  },
  {
    question: "What is the selection process for government jobs?",
    answer: "The selection process typically involves multiple stages: written examination (prelims and mains), skill test/typing test (where applicable), physical efficiency test (for police/defence), document verification, and medical examination. The final selection is based on merit in all stages combined.",
  },
  {
    question: "Are there age relaxations for reserved categories?",
    answer: "Yes, the government provides age relaxation for reserved categories as per rules. SC/ST candidates typically get 5 years relaxation, OBC gets 3 years, PWD gets 10 years, and Ex-Servicemen get relaxation based on service duration. Age relaxation varies by exam and department.",
  },
  {
    question: "How often are government job notifications released?",
    answer: "Government job notifications are released throughout the year. Major recruitments like SSC CGL, UPSC Civil Services, and Banking exams follow annual cycles. State-level and department-specific notifications are released as per vacancies. You can subscribe to our notifications to get real-time alerts.",
  },
  {
    question: "Can I apply for multiple government jobs simultaneously?",
    answer: "Yes, you can apply for multiple government jobs as long as you meet the eligibility criteria for each. However, you cannot apply multiple times for the same exam. You should check exam dates to avoid scheduling conflicts. Our portal helps you track all your applications in one place.",
  },
]

export function FAQ({ items = defaultItems, className }: FAQProps) {
  return (
    <section className={cn("bg-gray-50 py-16", className)}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
            <HelpCircle className="h-5 w-5 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Everything you need to know about government jobs
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <Accordion type="single" collapsible className="px-2">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="px-4 text-left text-sm font-medium text-gray-900 hover:text-teal-700 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-sm leading-relaxed text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
