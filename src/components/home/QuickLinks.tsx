import Link from "next/link"
import {
  Briefcase,
  FileText,
  Award,
  Key,
  BookOpen,
  GraduationCap,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface QuickLink {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  accent: string
}

const links: QuickLink[] = [
  {
    title: "Active Jobs",
    description: "Browse and apply to active government job vacancies",
    href: "/jobs",
    icon: <Briefcase className="h-5 w-5" />,
    accent: "border-l-blue-600",
  },
  {
    title: "Admit Cards",
    description: "Download hall tickets for upcoming examinations",
    href: "/admit-cards",
    icon: <FileText className="h-5 w-5" />,
    accent: "border-l-purple-500",
  },
  {
    title: "Exam Results",
    description: "View recently published exam results",
    href: "/results",
    icon: <Award className="h-5 w-5" />,
    accent: "border-l-emerald-500",
  },
  {
    title: "Answer Keys",
    description: "Download answer keys for conducted exams",
    href: "/answer-keys",
    icon: <Key className="h-5 w-5" />,
    accent: "border-l-amber-500",
  },
  {
    title: "Syllabus",
    description: "Get detailed syllabus for various exams",
    href: "/syllabus",
    icon: <BookOpen className="h-5 w-5" />,
    accent: "border-l-rose-500",
  },
  {
    title: "Admissions",
    description: "Check latest admission notifications",
    href: "/admissions",
    icon: <GraduationCap className="h-5 w-5" />,
    accent: "border-l-cyan-600",
  },
]

export function QuickLinks({ className }: { className?: string }) {
  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Quick Access
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            Everything you need to track your government job applications
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link, i) => (
            <div key={link.title} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <Link href={link.href} className="group block">
                <Card className={cn(
                  "border-l-[3px] border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                  link.accent
                )}>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600 group-hover:text-blue-600 transition-colors">
                      {link.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {link.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {link.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-blue-500" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
