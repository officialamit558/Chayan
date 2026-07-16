"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { registerSchema, type RegisterInput } from "@/lib/validations"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/toast"

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" }
  if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500" }
  return { score, label: "Strong", color: "bg-green-500" }
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch("password", "")
  const strength = getPasswordStrength(password)

  async function onSubmit(data: RegisterInput) {
    if (!acceptedTerms) {
      toast("Please accept the terms and conditions", "destructive")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast(err.error || "Registration failed", "destructive")
        return
      }

      toast("Account created successfully! Please sign in.", "success")
      router.push("/login")
    } catch {
      toast("An error occurred. Please try again.", "destructive")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-50 px-4 py-12 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-gray-200 shadow-xl dark:border-gray-800">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Enter your details to create a new account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={cn(errors.email && "border-red-500")}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    {...register("password")}
                    className={cn(errors.password && "border-red-500", "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-1">
                    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={cn("transition-all duration-300", strength.color)}
                        style={{ width: `${(strength.score / 6) * 100}%` }}
                      />
                    </div>
                    <p className={cn("text-xs font-medium", strength.color.replace("bg-", "text-"))}>
                      {strength.label}
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm font-medium text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    className={cn(errors.confirmPassword && "border-red-500", "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I accept the{" "}
                  <Link href="/terms" className="text-teal-600 hover:text-teal-700">
                    Terms and Conditions
                  </Link>
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-teal-600 hover:text-teal-700">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
