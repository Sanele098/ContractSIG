"use server"

import { createClient } from "@/lib/supabase/server"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ["application/pdf"]
const BUCKET_NAME = "company-documents"

export async function uploadDocument(
  file: File,
  documentType: string,
  companyId: string
) {
  try {
    // Validate file
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    if (file.type !== "application/pdf") {
      return { success: false, error: "Only PDF files are allowed" }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File size must be less than 5MB" }
    }

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Generate unique file path
    const timestamp = Date.now()
    const fileExt = "pdf"
    const fileName = `${documentType}-${timestamp}.${fileExt}`
    const filePath = `${user.id}/${companyId}/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("[v0] Upload error:", uploadError)
      return { success: false, error: "Failed to upload file" }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    // Save document record to database
    const { data, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        company_id: companyId,
        document_type: documentType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        is_required: ["company_registration", "tax_certificate"].includes(documentType),
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      // Delete uploaded file if database insert fails
      await supabase.storage.from(BUCKET_NAME).remove([filePath])
      return { success: false, error: "Failed to save document record" }
    }

    return {
      success: true,
      data: {
        ...data,
        publicUrl,
      },
    }
  } catch (error) {
    console.error("[v0] Error uploading document:", error)
    return { success: false, error: String(error) }
  }
}

export async function getDocuments(documentType?: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, data: [] }
    }

    let query = supabase.from("documents").select("*").eq("user_id", user.id)

    if (documentType) {
      query = query.eq("document_type", documentType)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching documents:", error)
      return { success: false, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("[v0] Error in getDocuments:", error)
    return { success: false, data: [] }
  }
}

export async function deleteDocument(documentId: string, filePath: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (storageError) {
      console.error("[v0] Storage delete error:", storageError)
      return { success: false, error: "Failed to delete file" }
    }

    // Delete database record
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId)
      .eq("user_id", user.id)

    if (dbError) {
      console.error("[v0] Database delete error:", dbError)
      return { success: false, error: "Failed to delete document record" }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting document:", error)
    return { success: false, error: String(error) }
  }
}
