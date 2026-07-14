"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
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
        <div className="bg-blue-600 dark:bg-blue-700 overflow-hidden">
          <div className="relative flex items-center mx-auto max-w-7xl px-4 py-1.5">
            <Megaphone className="h-4 w-4 shrink-0 text-yellow-300 mr-2" />
            <div className="overflow-hidden flex-1">
              <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
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
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <MobileNav />
              <LogoSmall />
            </div>

            <nav className="hidden lg:flex items-center gap-1">
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
                      "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                    )}
                  >
                    {link.title}
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                      />
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
                className="text-gray-600 dark:text-gray-400"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

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
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
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
