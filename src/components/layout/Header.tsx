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
  Megaphone,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mainNav } from "@/lib/constants"
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

const tickerItems = [
  "SSC CGL 2025 Tier I Results Announced - Check Now",
  "UPSC Civil Services 2025 Prelims Admit Card Released",
  "IBPS RRB PO 2025 Notification Out - Apply by August 15",
  "Railway RRB Group D 2025 Result Declared",
  "CTET July 2025 Answer Key Available for Download",
  "BPSC 68th Combined Exam Admit Card Released",
]

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
        <div className="bg-teal-600 dark:bg-teal-700 overflow-hidden">
          <div className="relative flex items-center mx-auto max-w-7xl px-4 py-1.5">
            <Megaphone className="h-4 w-4 shrink-0 text-yellow-300 mr-2" />
            <div className="overflow-hidden flex-1">
              <div className="flex animate-ticker whitespace-nowrap">
                <div className="flex gap-8 shrink-0">
                  {tickerItems.map((item, i) => (
                    <span
                      key={i}
                      className="text-xs text-white/90 font-medium whitespace-nowrap"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex gap-8 shrink-0">
                  {tickerItems.map((item, i) => (
                    <span
                      key={`dup-${i}`}
                      className="text-xs text-white/90 font-medium whitespace-nowrap"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              <MobileNav />
              <LogoSmall />
            </div>

            <nav className="hidden lg:flex items-center gap-0.5">
              {mainNav.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200",
                      isActive
                        ? "text-teal-700 dark:text-teal-300"
                        : "text-gray-700 hover:text-teal-600 hover:bg-teal-50/60 dark:text-gray-300 dark:hover:text-teal-300 dark:hover:bg-teal-950/40"
                    )}
                  >
                    {link.title}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 dark:bg-teal-400 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
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
                        <AvatarFallback className="text-xs bg-teal-100 text-teal-700">
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
                  <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950/50" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white" asChild>
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
