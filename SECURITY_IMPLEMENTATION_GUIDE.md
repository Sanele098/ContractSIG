# ContractSIG Security Implementation Guide for Interns

## Overview
This document outlines all security features to be implemented based on code comments already added throughout the codebase. Each feature location is documented below.

---

## 1. SESSION TIMEOUT & AUTOMATIC LOGOUT
**Location:** `lib/supabase/proxy.ts`
**File Line:** Top of updateSession() function (now has detailed comments)

### Implementation Tasks:
- [ ] Add session timeout detection (30 min inactivity default)
  - Track last activity timestamp in Redis or Upstash
  - Compare current time with last activity timestamp
  - Redirect to login if > 30 minutes of inactivity
- [ ] Implement refresh token rotation
  - Check token age on each request
  - Refresh if approaching expiry
  - Rotate refresh token for enhanced security
- [ ] Add logout notification message
  - Show "Session expired" message on redirect
  - Suggest user log back in

**Dependencies:** Upstash Redis (for session tracking)
**Priority:** HIGH

---

## 2. LOGIN ATTEMPT MONITORING & RATE LIMITING
**Location:** `app/auth/login/page.tsx`
**File Lines:** handleLogin() function (now has detailed comments and TODO markers)

### Implementation Tasks:
- [ ] Create rate limiting service
  - File: `app/api/auth/rate-limit/route.ts` (NEW)
  - Track failed attempts by email + IP address
  - Block after 5 failed attempts for 15 minutes
  - Clear counter on successful login
- [ ] Implement auth logging
  - Create auth_logs table in Supabase
  - Log columns: id, email, ip_address, user_agent, status (success/failure), timestamp
  - Insert log on every login attempt
- [ ] Add temporary account lockout
  - After 5 failed attempts, lock account for 15 minutes
  - Send email notification to user
  - Provide "Unlock" link in email
- [ ] Implement Remember Me
  - Extend session to 30 days if checked
  - Store in Supabase auth metadata
- [ ] Password reset implementation
  - Create `/auth/forgot-password` page (NEW)
  - Create `/auth/reset-password` page (NEW)
  - Use Supabase's resetPasswordForEmail() function

**New Files to Create:**
- `app/api/auth/rate-limit/route.ts`
- `app/api/auth/log-attempt/route.ts`
- `app/auth/forgot-password/page.tsx`
- `app/auth/reset-password/page.tsx`

**Dependencies:** Supabase Tables (auth_logs)
**Priority:** CRITICAL

---

## 3. FILE SIZE LIMITS & STORAGE QUOTA
**Location:** `lib/document-helpers.ts`
**File Lines:** uploadDocument() function (now has detailed comments)

### Implementation Tasks:
- [ ] Enhance file size validation
  - Current: 5MB hard limit
  - TODO: Make configurable per user plan tier
  - Free: 100MB total, Pro: 1GB total, Enterprise: 10GB total
- [ ] Implement per-user storage quota
  - Create users table with used_storage + storage_limit columns
  - Check quota before allowing upload
  - Block upload if quota exceeded
  - Show warning at 80% usage
- [ ] Add file magic byte validation
  - Validate actual PDF structure (not just .pdf extension)
  - Prevent malicious file uploads with wrong extension
- [ ] Implement malware scanning
  - Optional: Integrate VirusTotal API or similar
  - Scan uploaded files for malware
  - Reject if threats detected
- [ ] Add audit logging
  - Log all uploads/deletions with user_id, timestamp, file_size
  - Store in audit_logs table
  - Use for compliance reporting

**SQL Needed:**
```sql
-- Add columns to users table
ALTER TABLE users ADD COLUMN used_storage BIGINT DEFAULT 0;
ALTER TABLE users ADD COLUMN storage_limit BIGINT DEFAULT 104857600; -- 100MB for free tier

-- Create audit logs table
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action VARCHAR(50), -- 'upload', 'delete', 'download'
  resource_type VARCHAR(50), -- 'document', 'file'
  resource_id UUID,
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  details JSONB
);
```

**Priority:** HIGH

---

## 4. DATA ISOLATION & ROW-LEVEL SECURITY (RLS)
**Location:** `lib/document-helpers.ts`
**File Lines:** uploadDocument(), getDocuments(), deleteDocument() functions

### Implementation Tasks:
- [ ] Verify user company access
  - Query user_companies table before upload
  - Ensure user_id has access to company_id
  - Prevent uploading to unauthorized companies
- [ ] Enable RLS on all tables
  - documents table: Only user_id can access their own
  - user_companies table: Only user_id can access their companies
  - contracts table: Only user_id or team members can access
  - companies table: Team member verification
- [ ] Add soft delete support
  - Mark documents as deleted instead of hard delete
  - Retain for 30 days for recovery
  - Add is_deleted and deleted_at columns to documents table
- [ ] Audit access attempts
  - Log all failed authorization attempts
  - Monitor for suspicious access patterns

**RLS Policy Examples:**
```sql
-- Documents RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own documents" 
  ON documents 
  FOR ALL 
  USING (auth.uid() = user_id);

-- User Companies RLS
ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their company memberships"
  ON user_companies
  FOR ALL
  USING (auth.uid() = user_id);
```

**Priority:** CRITICAL

---

## 5. ROLE-BASED ACCESS CONTROL (RBAC)
**Location:** `lib/supabase/proxy.ts` (middleware)
**New Files Needed:**

### Implementation Tasks:
- [ ] Create RBAC system
  - Add user_role column to auth.users table: 'admin', 'manager', 'member'
  - Create roles table with permissions
  - Create role_permissions junction table
- [ ] Implement permission checking
  - Create utility: `lib/auth/check-permission.ts`
  - Function: hasPermission(userId, requiredPermission)
  - Use in middleware before allowing route access
- [ ] Add middleware checks
  - Verify user role on protected routes
  - Return 403 Forbidden if unauthorized
  - Log unauthorized access attempts
- [ ] Create role management UI
  - Page: `/dashboard/team` - already exists, add role assignment
  - Allow admin to assign roles to team members
- [ ] Document permissions matrix
  - Admin: All actions
  - Manager: Manage team, view all contracts, approve bids
  - Member: View own work, create contracts
  - Viewer: Read-only access

**New Files to Create:**
- `lib/auth/check-permission.ts`
- `lib/auth/rbac-config.ts` (define all permissions)

**Priority:** HIGH

---

## 6. PRIVACY POLICY & TERMS OF SERVICE
**Location:** New pages needed

### Implementation Tasks:
- [ ] Create Privacy Policy page
  - File: `app/privacy-policy/page.tsx`
  - Cover: data collection, usage, third-party sharing, cookies
  - Make legally compliant for your jurisdiction
- [ ] Create Terms of Service page
  - File: `app/terms-of-service/page.tsx`
  - Cover: user responsibilities, liability, usage rights
  - Define prohibited activities
- [ ] Create Cookie Consent banner
  - File: `components/cookie-consent.tsx`
  - Show on first visit
  - Allow accept/reject
  - Store preference in localStorage
- [ ] Add links in footer
  - Update app/layout.tsx footer
  - Link to privacy and terms pages
- [ ] Require acceptance at signup
  - Add checkbox on sign-up form
  - Require checkbox before account creation
  - Store acceptance timestamp in users table

**SQL Needed:**
```sql
ALTER TABLE auth.users ADD COLUMN accepted_terms_at TIMESTAMP;
ALTER TABLE auth.users ADD COLUMN accepted_privacy_at TIMESTAMP;
```

**Priority:** MEDIUM (Legal requirement)

---

## 7. AUTHENTICATION MONITORING & AUDIT LOGGING
**Location:** Multiple locations (already has comments)

### Implementation Tasks:
- [ ] Create comprehensive audit logging
  - Log all authentication events
  - Log all data modifications (create, update, delete)
  - Log all role/permission changes
  - Include timestamp, user_id, ip_address, action, details
- [ ] Create audit dashboard
  - Page: `/dashboard/audit-logs` (admin only)
  - Show login attempts, failed logins, data changes
  - Filter by date, user, action type
  - Export audit logs for compliance
- [ ] Set up security alerts
  - Alert on 5+ failed logins from same IP
  - Alert on mass data deletions
  - Alert on permission escalation attempts
  - Alert on downloads from unusual locations
- [ ] Monitor suspicious patterns
  - Multiple failed logins
  - Access outside business hours
  - Geographic anomalies
  - Concurrent session limits (only 1 active session per user)

**Priority:** HIGH

---

## Summary by Priority

### CRITICAL (Do First)
1. Data Isolation & RLS Verification
2. Login Rate Limiting & Monitoring
3. File Upload Validation
4. User Company Access Verification

### HIGH (Do Soon)
1. Session Timeout Implementation
2. RBAC System
3. Audit Logging
4. Storage Quota Implementation

### MEDIUM (Do Next)
1. Privacy Policy & Terms of Service
2. Malware Scanning Integration
3. Soft Delete Implementation

### LOW (Nice to Have)
1. Concurrent Session Limits
2. Geo-location Monitoring
3. Advanced Threat Detection

---

## Testing Checklist

After implementing each feature, test:
- [ ] Security tests (unauthorized access attempts)
- [ ] Boundary tests (max file size, quota limits)
- [ ] Error handling (graceful failures)
- [ ] Logging verification (events are logged correctly)
- [ ] Performance impact (no significant slowdown)
- [ ] User experience (clear error messages)

---

## Resources & References

- Supabase RLS Documentation: https://supabase.com/docs/guides/auth/row-level-security
- OWASP Security Guidelines: https://owasp.org/www-project-top-ten/
- Supabase Auth Best Practices: https://supabase.com/docs/guides/auth/overview
- Next.js Security: https://nextjs.org/docs/advanced-features/security-headers

---

## Questions?

Refer to code comments in:
- `lib/supabase/proxy.ts` - Session & middleware security
- `app/auth/login/page.tsx` - Login security
- `lib/document-helpers.ts` - File upload & data isolation security

All TODO items are marked with comments in the code.
