"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getCompany(id: string) {
  try {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error fetching company:", error)
    return { success: false, data: null }
  }
}

export async function saveCompany(id: string, company: any) {
  try {
    const { data, error } = await supabase
      .from("companies")
      .upsert({
        id,
        name: company.name || "",
        registration_number: company.registrationNumber || "",
        industry: company.industry || "",
        employees: company.employees || 0,
        website: company.website || "",
        description: company.description || "",
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error saving company:", error)
    return { success: false, error: String(error) }
  }
}
