import { createClient } from "@supabase/supabase-js"

/**
 * Service role client for privileged operations like bucket creation.
 * This uses the service role key and should only be used server-side
 * for admin-level operations.
 */
export async function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
