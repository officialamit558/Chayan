"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  Home,
  Briefcase,
  Award,
  CreditCard,
  FileText,
  BookOpen,
  GraduationCap,
  Bell,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Bookmark,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { mainNav } from "@/lib/constants"
import { ThemeToggle } from "./ThemeToggle"
import { LogoSmall } from "@/components/layout/LogoSmall"

const navIconMap: Record<string, React.ElementType> = {
  Home,
  Jobs: Briefcase,
  Results: Award,
  "Admit Cards": CreditCard,
  "Answer Keys": FileText,
  Syllabus: BookOpen,
  Admissions: GraduationCap,
  Notifications: Bell,
}

export function MobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-700">
            <div onClick={() => setOpen(false)}>
              <LogoSmall />
            </div>
            <ThemeToggle />
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-3 py-2">
              <p className="px-2 text-xs font-medium uppercase tracking-wider text-gray-500">Menu</p>
            </div>
            <nav className="space-y-0.5 px-2">
              {mainNav.map((link) => {
                const Icon = navIconMap[link.title] || Briefcase
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)
                return (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.title}
                    </Link>
                  </SheetClose>
                )
              })}
            </nav>

            <Separator className="my-3" />

            <div className="px-3 py-2">
              <p className="px-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                Quick Categories
              </p>
            </div>
            <div className="space-y-0.5 px-2">
              {[
                { label: "Central Govt Jobs", href: "/category/central" },
                { label: "State Govt Jobs", href: "/category/state" },
                { label: "Bank Jobs", href: "/category/bank" },
                { label: "Railway Jobs", href: "/category/railway" },
                { label: "Defence Jobs", href: "/category/defence" },
              ].map((cat) => (
                <SheetClose key={cat.href} asChild>
                  <Link
                    href={cat.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    {cat.label}
                  </Link>
                </SheetClose>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="space-y-0.5 px-2">
              {session?.user ? (
                <>
                  <SheetClose asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/bookmarks"
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <Bookmark className="h-4 w-4" />
                      Bookmarks
                    </Link>
                  </SheetClose>
                  <button
                    onClick={() => {
                      signOut()
                      setOpen(false)
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/register"
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
                    >
                      <UserPlus className="h-4 w-4" />
                      Register
                    </Link>
                  </SheetClose>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
