import Link from "next/link"
import {
  Globe,
  MessageCircle,
  Camera,
  Video,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { siteConfig, footerLinks } from "@/lib/constants"
import { cn } from "@/lib/utils"

const socialLinks = [
  { label: "Facebook", icon: Globe, href: siteConfig.links.facebook },
  { label: "Twitter", icon: MessageCircle, href: siteConfig.links.twitter },
  { label: "Instagram", icon: Camera, href: "https://instagram.com" },
  { label: "YouTube", icon: Video, href: siteConfig.links.youtube },
]

const importantLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Copyright Policy", href: "/copyright" },
  { label: "DMCA", href: "/dmca" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "RSS Feed", href: "/rss" },
]

export function Footer({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn("border-t border-gray-200 bg-white text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-4 text-sm leading-relaxed">
              {siteConfig.description}. We provide the latest government job notifications, exam
              results, admit cards, answer keys, and more.
            </p>
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                <span>contact@chayan.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                <span>+91-11-23456789</span>
              </div>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-teal-600 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-teal-600 dark:hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-200 dark:bg-gray-800" />

        <div className="flex items-center justify-center py-10">
          <div className="text-7xl font-bold tracking-[0.15em] text-gray-900 dark:text-white sm:text-8xl md:text-9xl">Chayan</div>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {importantLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs transition-colors hover:text-teal-600 dark:hover:text-teal-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Separator className="my-6 bg-gray-200 dark:bg-gray-800" />

        <div className="text-center text-xs">
          <p>&copy; {currentYear} {siteConfig.name}. All rights reserved.</p>
          <p className="mt-1">
            Powered by Chayan | Last updated: {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </footer>
  )
}
