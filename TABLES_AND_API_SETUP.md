## Database Tables Created for Security Features

I've created 6 SQL migration scripts in the `scripts/` folder that interns must run in Supabase. Here's what was created:

### 1. **Authentication Logs** (`01_create_auth_logs_table.sql`)
- **Table:** `auth_logs`
- **Purpose:** Track all login attempts (success/failure) for auditing
- **Columns:** user_id, email, attempt_status, ip_address, user_agent, failure_reason, created_at
- **API Route Needed:** `POST /api/auth/log-attempt`
  ```
  Body: { email, status, ip_address, user_agent, failure_reason? }
  Action: Insert into auth_logs table
  ```

### 2. **Failed Login Attempts** (`02_create_failed_login_attempts_table.sql`)
- **Table:** `failed_login_attempts`
- **Purpose:** Track failed attempts for rate limiting (block after 5 failures in 15 min)
- **Columns:** email, ip_address, failed_count, last_attempt, blocked_until
- **API Route Needed:** `POST /api/auth/rate-limit`
  ```
  Body: { email, action: 'check' | 'increment' | 'reset' }
  
  Check Action:
    - Return { blocked: boolean, attemptsRemaining: number }
    - If >= 5 attempts in 15 min window, return blocked: true
  
  Increment Action:
    - After failed login, increment failed_count
    - If >= 5, set blocked_until = NOW() + 15 min
  
  Reset Action:
    - After successful login, reset failed_count to 0
  ```

### 3. **Audit Logs** (`03_create_audit_logs_table.sql`)
- **Table:** `audit_logs`
- **Purpose:** Track ALL user actions (document uploads, deletions, modifications)
- **Columns:** user_id, company_id, action, resource_type, resource_id, details, status, created_at
- **API Route Needed:** `POST /api/audit/log`
  ```
  Body: {
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'DOWNLOAD',
    resource_type: 'document' | 'contract' | 'user',
    resource_id: string,
    details: { file_size?, mime_type?, etc }
  }
  Action: Insert audit log record
  ```

### 4. **RBAC Tables** (`04_create_rbac_tables.sql`)
- **Tables:** `permissions`, `role_permissions`, `team_members`
- **Purpose:** Implement role-based access control (admin/manager/member)
- **Roles:**
  - **Admin:** All permissions
  - **Manager:** Most permissions (can't delete contracts, manage team)
  - **Member:** View and upload only
- **Key Table - team_members:**
  - Links users to companies with specific role
  - Used to determine what a user can do
- **API Route Needed:** `POST /api/team/add-member`
  ```
  Body: { company_id, user_email, role: 'admin' | 'manager' | 'member' }
  Action: 
    1. Find user by email
    2. Insert into team_members table
    3. Log in audit_logs
  ```

### 5. **Legal Acceptance** (`05_create_legal_acceptance_table.sql`)
- **Table:** `legal_acceptances`
- **Purpose:** Track when users accept Privacy Policy & Terms of Service
- **Columns:** user_id, document_type, version, accepted, accepted_at, ip_address
- **API Routes Needed:**
  ```
  POST /api/legal/accept
  Body: { document_type: 'privacy_policy' | 'terms_of_service', version: '1.0' }
  Action: Insert acceptance record
  
  GET /api/legal/status
  Returns: { privacy_policy_accepted: boolean, terms_accepted: boolean, version: '1.0' }
  
  GET /api/legal/need-acceptance
  Returns: List of documents that need acceptance
  ```

### 6. **RLS Policies** (`06_create_rls_policies.sql`)
- **Purpose:** Database-level security to prevent unauthorized data access
- **Enforces:** Users can only access their own company's data
- **Tables Updated:** documents, companies
- **Critical:** Even if frontend is hacked, RLS policies prevent data theft

---

## How Interns Should Implement

### Step 1: Run Database Migrations
1. Go to Supabase dashboard
2. Navigate to SQL Editor
3. Copy each script from `scripts/01` through `scripts/06`
4. Run them in order
5. Verify tables created in Tables section

### Step 2: Create API Routes
Create these files in `app/api/`:
- `app/api/auth/log-attempt/route.ts` - Log login attempts
- `app/api/auth/rate-limit/route.ts` - Check/track rate limiting
- `app/api/audit/log/route.ts` - Log user actions
- `app/api/team/add-member/route.ts` - Add team member with role
- `app/api/legal/accept/route.ts` - Accept privacy/terms
- `app/api/legal/status/route.ts` - Check legal acceptance status

### Step 3: Update Frontend Code
- Use the TODO comments in source code files:
  - `app/auth/login/page.tsx` - Call rate-limit API before login
  - `lib/document-helpers.ts` - Log audit events on upload/delete
  - `app/dashboard/team/page.tsx` - Integrate RBAC checks
  - Create legal pages at `/legal/privacy` and `/legal/terms`

---

## Table Dependencies

```
auth_logs → references auth.users
failed_login_attempts → standalone (queries by email/IP)
audit_logs → references auth.users, companies
permissions → standalone
role_permissions → references permissions
team_members → references auth.users, companies
legal_acceptances → references auth.users
```

All tables have Row Level Security (RLS) enabled for data isolation.

---

## Testing Checklist

After implementation, interns should test:
- [ ] User A cannot see User B's documents (RLS works)
- [ ] Failed logins increment counter and block after 5 attempts
- [ ] Failed counter resets after successful login
- [ ] Audit logs record document upload/delete
- [ ] Team member roles restrict access correctly
- [ ] Users must accept legal docs on signup
- [ ] Admin can view all audit logs
- [ ] Rate limiting blocks brute force attacks
