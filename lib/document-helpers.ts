/**
 * SECURITY: File Upload & Data Isolation
 * Location: lib/document-helpers.ts
 * 
 * IMPLEMENTATION TASKS FOR INTERNS:
 * 1. Enhanced File Size Limits
 *    - MAX_FILE_SIZE is 5MB, should be configurable per user plan
 *    - Add per-user storage quota (check against used_storage in users table)
 *    - Implement soft limit warning at 80% and hard limit at 100%
 *    - TODO: Add user plan tier checking (free: 100MB, pro: 1GB, enterprise: 10GB)
 * 
 * 2. File Validation Enhancement
 *    - Validate file magic bytes (not just extension) to prevent spoofing
 *    - Scan for malware using VirusTotal API or similar
 *    - Validate PDF structure to prevent malicious files
 * 
 * 3. Data Isolation Verification (Row-Level Security)
 *    - CRITICAL: Verify user owns the company_id before allowing upload
 *    - Check auth.uid() == user_id AND user has access to company
 *    - This prevents users from uploading to other users' documents
 *    - TODO: Query user_companies table to verify relationship
 * 
 * 4. Access Control on Download/Retrieval
 *    - getDocuments() should verify user owns document before returning
 *    - deleteDocument() already checks user_id but verify company ownership too
 * 
 * 5. Audit Logging
 *    - Log all file uploads/deletes with user_id, timestamp, file_size
 *    - Store in audit_logs table for compliance
 * 
 * Reference: docs/SECURITY_IMPLEMENTATION.md
 */
"use server"

import { createClient } from "@/lib/supabase/server"
import { ensureBucketExists } from "./bucket-init"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB - TODO: Make configurable per user plan
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

    // TODO: SECURITY - Validate PDF file magic bytes
    // const fileBuffer = await file.arrayBuffer()
    // const view = new Uint8Array(fileBuffer)
    // if (view[0] !== 0x25 || view[1] !== 0x50 || view[2] !== 0x44) {
    //   return { success: false, error: "Invalid PDF file" }
    // }

    // Ensure bucket exists before uploading
    const bucketResult = await ensureBucketExists()
    if (!bucketResult.success) {
      console.error("[ContractSIG] Bucket initialization failed:", bucketResult.error)
      return { success: false, error: "Failed to initialize storage. Please try again." }
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

    // TODO: SECURITY - DATA ISOLATION CHECK (CRITICAL)
    // Verify that the user has permission to upload to this company
    // Query the user_companies table to ensure user_id has ownership/access to companyId
    // Example:
    // const { data: access } = await supabase
    //   .from('user_companies')
    //   .select('*')
    //   .eq('user_id', user.id)
    //   .eq('company_id', companyId)
    //   .single()
    // if (!access) return { success: false, error: "Unauthorized: You don't have access to this company" }
    
    // TODO: SECURITY - Check user storage quota
    // const { data: userData } = await supabase
    //   .from('users')
    //   .select('used_storage, storage_limit')
    //   .eq('id', user.id)
    //   .single()
    // if ((userData.used_storage + file.size) > userData.storage_limit) {
    //   return { success: false, error: "Storage quota exceeded" }
    // }

    // Generate unique file path
    const timestamp = Date.now()
    const fileExt = "pdf"
    const fileName = `${documentType}-${timestamp}.${fileExt}`
    const filePath = `${user.id}/${companyId}/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("[ContractSIG] Upload error:", uploadError)
      return { success: false, error: uploadError.message || "Failed to upload file" }
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
      console.error("[ContractSIG] Database error:", dbError)
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
    console.error("[ContractSIG] Error uploading document:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * SECURITY: Data Isolation in Retrieval
 * - Only returns documents owned by authenticated user
 * - RLS policy should enforce this at database level too
 * - TODO: Verify RLS is enabled on documents table for user_id
 */
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

    // Filters by user_id - database RLS policy should also enforce this
    let query = supabase.from("documents").select("*").eq("user_id", user.id)

    if (documentType) {
      query = query.eq("document_type", documentType)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("[ContractSIG] Error fetching documents:", error)
      return { success: false, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("[ContractSIG] Error in getDocuments:", error)
    return { success: false, data: [] }
  }
}

/**
 * SECURITY: Data Isolation in Deletion
 * - Critical: Only deletes documents owned by the authenticated user
 * - .eq("user_id", user.id) prevents users from deleting others' documents
 * - TODO: Add audit logging - log all deletions with timestamp, user_id, document_id
 * - TODO: Implement soft deletes (mark as deleted, retain for 30 days for recovery)
 */
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

    // TODO: SECURITY - Verify document ownership before deletion
    // const { data: doc } = await supabase
    //   .from('documents')
    //   .select('user_id, company_id')
    //   .eq('id', documentId)
    //   .single()
    // if (doc.user_id !== user.id) {
    //   console.error("[ContractSIG] Unauthorized delete attempt:", { userId: user.id, documentId })
    //   return { success: false, error: "Unauthorized" }
    // }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (storageError) {
      console.error("[ContractSIG] Storage delete error:", storageError)
      return { success: false, error: "Failed to delete file" }
    }

    // Delete database record - only if user_id matches (data isolation)
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId)
      .eq("user_id", user.id) // CRITICAL: Ensures user can only delete their own documents

    if (dbError) {
      console.error("[ContractSIG] Database delete error:", dbError)
      return { success: false, error: "Failed to delete document record" }
    }

    return { success: true }
  } catch (error) {
    console.error("[ContractSIG] Error deleting document:", error)
    return { success: false, error: String(error) }
  }
}
