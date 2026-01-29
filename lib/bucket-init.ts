"use server"

import { createServiceRoleClient } from "@/lib/supabase/service-client"

export async function ensureBucketExists() {
  try {
    const supabase = await createServiceRoleClient()

    // List existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("[v0] Error listing buckets:", listError)
      return { success: false, error: "Failed to check buckets" }
    }

    // Check if bucket already exists
    const bucketExists = buckets?.some((b) => b.name === "company-documents")

    if (bucketExists) {
      console.log("[v0] Bucket 'company-documents' already exists")
      return { success: true, message: "Bucket already exists" }
    }

    // Create the bucket if it doesn't exist
    const { data: bucket, error: createError } = await supabase.storage.createBucket(
      "company-documents",
      {
        public: true,
        allowedMimeTypes: ["application/pdf"],
        fileSizeLimit: 5242880, // 5MB in bytes
      }
    )

    if (createError) {
      console.error("[v0] Error creating bucket:", createError)
      return { success: false, error: createError.message }
    }

    console.log("[v0] Bucket 'company-documents' created successfully")
    return { success: true, message: "Bucket created successfully" }
  } catch (error) {
    console.error("[v0] Error in ensureBucketExists:", error)
    return { success: false, error: String(error) }
  }
}
