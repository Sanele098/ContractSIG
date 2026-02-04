"use client"

import { CardContent } from "@/components/ui/card"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import React, { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Chrome, Apple } from "lucide-react"

/**
 * SECURITY: Authentication & Rate Limiting
 * Location: app/auth/login/page.tsx
 * 
 * IMPLEMENTATION TASKS FOR INTERNS:
 * 1. Rate Limiting Implementation
 *    - Create rate-limiter in app/api/auth/rate-limit/route.ts
 *    - Track failed login attempts by email/IP address
 *    - Block after 5 failed attempts for 15 minutes
 *    - Clear counter on successful login
 * 
 * 2. Login Attempt Logging
 *    - Log ALL login attempts (success & failure) to auth_logs table
 *    - Include: email, timestamp, ip_address, user_agent, success_status
 *    - Use for audit trail and security monitoring
 * 
 * 3. Remember Me Implementation
 *    - Extend session duration if checked (30 days instead of 7)
 *    - Store in Supabase auth metadata
 * 
 * 4. Password Reset Link
 *    - Implement /auth/forgot-password page
 *    - Send reset email via Supabase auth.resetPasswordForEmail()
 *    - Create /auth/reset-password page with token validation
 * 
 * Reference: docs/SECURITY_IMPLEMENTATION.md
 */
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  // TODO: Add state for rate limit status
  // const [rateLimited, setRateLimited] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // TODO: SECURITY - Check rate limiting before login attempt
      // const rateLimitCheck = await fetch('/api/auth/rate-limit', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, action: 'check' })
      // })
      // if (!rateLimitCheck.ok) return setError("Too many login attempts. Try again in 15 minutes.")

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      // TODO: SECURITY - Log successful login attempt
      // await logAuthAttempt(email, 'success', request.ip_address)

      router.push("/dashboard")
    } catch (error: unknown) {
      // TODO: SECURITY - Log failed login attempt and increment counter
      // await logAuthAttempt(email, 'failure', request.ip_address)
      // await incrementFailedAttempts(email)

      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  const handleAppleLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header with Logo */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-500 rounded-full" />
              <span className="text-lg font-semibold text-foreground">ContractSIG</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Please enter your details to sign in</p>
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-12 h-12 rounded-full border border-border hover:bg-muted transition-colors flex items-center justify-center"
            >
              <Chrome size={20} className="text-foreground" />
            </button>
            <button
              onClick={handleAppleLogin}
              disabled={isLoading}
              className="w-12 h-12 rounded-full border border-border hover:bg-muted transition-colors flex items-center justify-center"
            >
              <Apple size={20} className="text-foreground" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Your Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-border text-foreground placeholder-muted-foreground"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-border text-foreground placeholder-muted-foreground pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-foreground hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-base transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-foreground font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
