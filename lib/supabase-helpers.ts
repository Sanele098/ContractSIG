"use server"

import { createClient } from "@/lib/supabase/server"

// Helper to check if user is authenticated
export async function checkAuth() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return { authenticated: false, user: null }
    }

    return { authenticated: true, user }
  } catch (error) {
    return { authenticated: false, user: null }
  }
}

export async function getCompanyProfile() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      // Return null if not authenticated (will be handled by caller)
      return { success: false, data: null, authenticated: false }
    }

    // Fetch company profile for this user
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found, which is fine for new users
      console.error("[v0] Error fetching company:", error)
      return { success: false, data: null, authenticated: true }
    }

    return { success: true, data: data || null, authenticated: true }
  } catch (error) {
    console.error("[v0] Error in getCompanyProfile:", error)
    return { success: false, data: null, authenticated: false }
  }
}

export async function saveCompanyProfile(profile: {
  name: string
  registrationNumber: string
  industry: string
  yearEstablished: number
  employees: number
  website: string
  description: string
  location: string
  phone: string
  email: string
}) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "Not authenticated", authenticated: false }
    }

    // Check if company already exists for this user
    const { data: existing } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .single()

    let result

    if (existing) {
      // Update existing
      result = await supabase
        .from("companies")
        .update({
          name: profile.name,
          registration_number: profile.registrationNumber,
          industry: profile.industry,
          year_established: profile.yearEstablished,
          employees: profile.employees,
          website: profile.website,
          description: profile.description,
          location: profile.location,
          phone: profile.phone,
          email: profile.email,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
    } else {
      // Create new
      result = await supabase.from("companies").insert({
        user_id: user.id,
        name: profile.name,
        registration_number: profile.registrationNumber,
        industry: profile.industry,
        year_established: profile.yearEstablished,
        employees: profile.employees,
        website: profile.website,
        description: profile.description,
        location: profile.location,
        phone: profile.phone,
        email: profile.email,
      })
    }

    if (result.error) {
      console.error("[v0] Error saving company:", result.error)
      return { success: false, error: result.error.message, authenticated: true }
    }

    return { success: true, authenticated: true }
  } catch (error) {
    console.error("[v0] Error in saveCompanyProfile:", error)
    return { success: false, error: String(error), authenticated: false }
  }
}

export async function isCompanyProfileComplete() {
  try {
    const result = await getCompanyProfile()

    // If not authenticated, return false
    if (!result.authenticated) {
      return { complete: false, authenticated: false }
    }

    if (!result.success || !result.data) {
      return { complete: false, authenticated: true }
    }

    const requiredFields = ["name", "registration_number", "industry", "employees", "description"]
    const isComplete = requiredFields.every((field) => {
      const value = result.data[field as keyof typeof result.data]
      return value !== null && value !== undefined && value !== "" && value !== 0
    })

    return { complete: isComplete, authenticated: true }
  } catch (error) {
    console.error("[v0] Error checking profile completion:", error)
    return { complete: false, authenticated: false }
  }
}
