"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  Search,
  User,
  LogOut,
  Bookmark,
  LayoutDashboard,
  ChevronDown,
  Briefcase,
  Building2,
  BookOpen,
  GraduationCap,
  Bell,
  Newspaper,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "./ThemeToggle"
import { MobileNav } from "./MobileNav"
import { SearchDialog, useSearchDialog } from "./SearchDialog"
import { LogoSmall } from "@/components/layout/LogoSmall"
import { NotificationBell } from "./NotificationBell"

function DateDisplay() {
  const [dateStr, setDateStr] = React.useState("")

  React.useEffect(() => {
    const update = () => {
      const now = new Date()
      setDateStr(now.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }))
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [])

  if (!dateStr) return null
  return <span className="text-xs text-blue-200 font-medium">{dateStr}</span>
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3.5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 rounded-md",
        isActive
          ? "text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/40"
          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 dark:text-gray-300 dark:hover:text-blue-300 dark:hover:bg-blue-950/40"
      )}
    >
      {children}
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { open: searchOpen, setOpen: setSearchOpen } = useSearchDialog()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const jobsActive = pathname.startsWith("/jobs") || pathname.startsWith("/private-jobs")
  const moreActive = pathname.startsWith("/syllabus") || pathname.startsWith("/admissions") || pathname.startsWith("/notifications") || pathname.startsWith("/blog")

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-shadow duration-200",
          scrolled
            ? "shadow-md bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/80"
            : "bg-white dark:bg-gray-950"
        )}
      >
        <div className="bg-[#1e3a5f] dark:bg-[#0f1f3d] border-b border-[#2a4a75]">
          <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-9">
            <span className="text-xs text-blue-200/80 font-medium hidden sm:block">
              Welcome to Chayan — Your Trusted Government Job Portal
            </span>
            <DateDisplay />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              <MobileNav />
              <LogoSmall />
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              <NavLink href="/">Home</NavLink>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative px-3.5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 rounded-md inline-flex items-center gap-1",
                      jobsActive
                        ? "text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/40"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 dark:text-gray-300 dark:hover:text-blue-300 dark:hover:bg-blue-950/40"
                    )}
                  >
                    Jobs
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/jobs" className="flex items-center gap-2 cursor-pointer">
                      <Briefcase className="h-4 w-4" />
                      Gov Jobs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/private-jobs" className="flex items-center gap-2 cursor-pointer">
                      <Building2 className="h-4 w-4" />
                      Private Jobs
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <NavLink href="/results">Results</NavLink>
              <NavLink href="/admit-cards">Admit Cards</NavLink>
              <NavLink href="/answer-keys">Answer Keys</NavLink>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative px-3.5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 rounded-md inline-flex items-center gap-1",
                      moreActive
                        ? "text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/40"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 dark:text-gray-300 dark:hover:text-blue-300 dark:hover:bg-blue-950/40"
                    )}
                  >
                    More
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/syllabus" className="flex items-center gap-2 cursor-pointer">
                      <BookOpen className="h-4 w-4" />
                      Syllabus
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admissions" className="flex items-center gap-2 cursor-pointer">
                      <GraduationCap className="h-4 w-4" />
                      Admissions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/blog" className="flex items-center gap-2 cursor-pointer">
                      <Newspaper className="h-4 w-4" />
                      Blog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications" className="flex items-center gap-2 cursor-pointer">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              <NotificationBell />

              <ThemeToggle />

              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image ?? ""}
                          alt={session.user.name ?? "User"}
                        />
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                          {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{session.user.name}</span>
                        <span className="text-xs font-normal text-gray-500">
                          {session.user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    {session.user.role === "ADMIN" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bookmarks" className="flex items-center gap-2 cursor-pointer">
                        <Bookmark className="h-4 w-4" />
                        Bookmarks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="flex items-center gap-2 text-red-600 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950/50" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
