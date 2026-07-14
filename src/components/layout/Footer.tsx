"use client"

import * as React from "react"
import Link from "next/link"
import {
  Globe,
  MessageCircle,
  Camera,
  Video,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  AlertTriangle,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { siteConfig, footerLinks } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { LogoSmall } from "@/components/layout/LogoSmall"

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
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "RSS Feed", href: "/rss" },
]

export function Footer({ className }: { className?: string }) {
  const [email, setEmail] = React.useState("")
  const currentYear = new Date().getFullYear()

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      console.log("Newsletter signup:", email)
      setEmail("")
    }
  }

  return (
    <footer className={cn("bg-gray-900 text-gray-300", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <LogoSmall />
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-400">
              {siteConfig.description}. We provide the latest government job notifications, exam
              results, admit cards, answer keys, and more.
            </p>
            <div className="mb-4 space-y-2 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                <span>contact@chayan.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-blue-400" />
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
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-blue-600 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-gray-400">
              Subscribe to get latest job alerts directly in your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                required
              />
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="mb-6 rounded-lg bg-gray-800/50 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
            <div>
              <h4 className="mb-1 text-sm font-semibold text-yellow-400">Important Notice</h4>
              <p className="text-xs leading-relaxed text-gray-400">
                This website is not affiliated with any government organization. We aggregate
                publicly available information from official sources for informational purposes only.
                Users are advised to verify all details on the respective official websites before
                applying. We do not charge any fees for job applications or exam registrations.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {importantLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-gray-500 transition-colors hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Separator className="my-6 bg-gray-800" />

        <div className="text-center text-xs text-gray-500">
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
