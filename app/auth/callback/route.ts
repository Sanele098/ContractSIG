import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    try {
      // Exchange the auth code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        // Redirect to dashboard - user is now authenticated
        return NextResponse.redirect(new URL("/dashboard/company", request.url))
      }
    } catch (err) {
      console.error("[v0] Error exchanging code for session:", err)
    }
  }

  // If anything fails, redirect to login
  return NextResponse.redirect(new URL("/auth/login", request.url))
}
