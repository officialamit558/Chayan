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
  gradient: string
}

const links: QuickLink[] = [
  {
    title: "Apply for Jobs",
    description: "Browse and apply to active government job vacancies",
    href: "/jobs",
    icon: <Briefcase className="h-6 w-6" />,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Download Admit Cards",
    description: "Download hall tickets for upcoming examinations",
    href: "/admit-cards",
    icon: <FileText className="h-6 w-6" />,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Check Results",
    description: "View recently published exam results",
    href: "/results",
    icon: <Award className="h-6 w-6" />,
    gradient: "from-green-500 to-green-600",
  },
  {
    title: "View Answer Keys",
    description: "Download answer keys for conducted exams",
    href: "/answer-keys",
    icon: <Key className="h-6 w-6" />,
    gradient: "from-orange-500 to-orange-600",
  },
  {
    title: "Download Syllabus",
    description: "Get detailed syllabus for various exams",
    href: "/syllabus",
    icon: <BookOpen className="h-6 w-6" />,
    gradient: "from-red-500 to-red-600",
  },
  {
    title: "Admissions",
    description: "Check latest admission notifications",
    href: "/admissions",
    icon: <GraduationCap className="h-6 w-6" />,
    gradient: "from-teal-500 to-teal-600",
  },
]

export function QuickLinks({ className }: { className?: string }) {
  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Quick Links
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Everything you need in one place
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <div key={link.title} className="animate-fade-in-up">
              <Link href={link.href} className="group block">
                <Card className="overflow-hidden border-gray-200 transition-all duration-300 hover:border-transparent hover:shadow-xl">
                  <CardContent className="relative p-0">
                    <div
                      className={cn(
                        "flex items-center gap-4 bg-gradient-to-r p-5 text-white",
                        link.gradient
                      )}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                        {link.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">{link.title}</h3>
                        <p className="mt-0.5 text-sm text-white/80">
                          {link.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
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
