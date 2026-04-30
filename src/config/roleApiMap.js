
// -----------------------------------------------------------------------
// ROLE → ALLOWED API PREFIX MAP
// Each role has a list of URL patterns it is permitted to call.
// Add future roles / endpoints simply by extending this map.
// -----------------------------------------------------------------------

export const ROLE_API_MAP = {
  // ─────────────────── SUPER ADMIN ───────────────────
  // Full access: can call any /api/admin/* route plus everything else
  'superadmin': {
    allowedPrefixes: [
      '/api/admin/',
      '/api/plan/',
      '/api/contract/',
      '/api/ticket/',
    ],
    allowAll: true, // Flag: bypass prefix check — hits everything
  },
  'superAdmin': { // Legacy camelCase support
    allowedPrefixes: [
      '/api/admin/',
      '/api/plan/',
      '/api/contract/',
    ],
    allowAll: true,
  },

  // ─────────────────── COMPANY ADMIN ───────────────────
  // Support both underscored and hyphenated versions common in varied backends
  'company_admin': {
    allowedPrefixes: [
      '/api/company/',
      '/api/company-admin/',
      '/api/contract/',
      '/api/task/',
      '/api/document/',
      '/api/employee/',
      '/api/plan/',
      '/api/group/',
      '/api/admin/getTask/',
      '/api/admin/assignUsers/',
      '/api/admin/removeUsers/',
      '/api/admin/getEmployeeForAssign/',
      '/api/ticket/',
    ],
    allowAll: false,
  },
  'company-admin': {
    allowedPrefixes: [
      '/api/company/',
      '/api/company-admin/',
      '/api/contract/',
      '/api/task/',
      '/api/document/',
      '/api/employee/',
      '/api/plan/',
      '/api/group/',
      '/api/admin/getTask/',
      '/api/admin/assignUsers/',
      '/api/admin/removeUsers/',
      '/api/admin/getEmployeeForAssign/',
      '/api/ticket/',
    ],
    allowAll: false,
  },
  'companyadmin': {
    allowedPrefixes: [
      '/api/company/',
      '/api/company-admin/',
      '/api/contract/',
      '/api/task/',
      '/api/document/',
      '/api/employee/',
      '/api/plan/',
      '/api/group/',
      '/api/admin/getTask/',
      '/api/admin/assignUsers/',
      '/api/admin/removeUsers/',
      '/api/admin/getEmployeeForAssign/',
      '/api/ticket/',
    ],
    allowAll: false,
  },

  // ─────────────────── GROUP ADMIN ───────────────────
  'group_admin': {
    allowedPrefixes: [
      '/api/group/getGroupFullDetails/',
      '/api/group/getGroupMembersForAssign/',
      '/api/group/getMyGroups',
      '/api/task/',
      '/api/admin/getTask/',
      '/api/admin/assignUsers/',
      '/api/admin/removeUsers/',
      '/api/ticket/',
    ],
    allowAll: false,
  },

  // ─────────────────── FINANCE MANAGER ───────────────────
  'finance_manager': {
    allowedPrefixes: [
      '/api/finance/',
      '/api/contract/',
      '/api/document/',
    ],
    allowAll: false,
  },

  // ─────────────────── EMPLOYEE ───────────────────
  // Restricted to personal routes only
  'employee': {
    allowedPrefixes: [
      '/api/tasks/my',
      '/api/profile',
      '/api/employee/',
      '/api/admin/getTask/',
      '/api/ticket/',
    ],
    allowAll: false,
  },
};


// -----------------------------------------------------------------------
// Validator: Call this before every API request.
// Returns true if the role is allowed to access the url.
// Returns false if blocked (403 territory).
// -----------------------------------------------------------------------

export function isApiAllowedForRole(role, url) {
  // Defensive: check for leading slash
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  
  // ─── GLOBAL PUBLIC ROUTES ───
  // Authentication endpoints should always be accessible to all roles.
  if (normalizedUrl.startsWith('/api/auth/')) {
    return true;
  }
  
  // Normalize role to lowercase for matching, supporting both hyphenated and underscored versions
  const normalizedRole = (role || '').toLowerCase();
  
  const config = ROLE_API_MAP[normalizedRole] || ROLE_API_MAP[role];

  // Unknown role → block everything
  if (!config) {
    console.error(`[RBAC] Unknown role "${role}" — blocking API call: ${normalizedUrl}`);
    return false;
  }


  // Super Admin with allowAll → pass everything through
  if (config.allowAll) {
    return true;
  }

  // Check if the url starts with any of the allowed prefixes
  const isAllowed = config.allowedPrefixes.some((prefix) =>
    normalizedUrl.startsWith(prefix)
  );

  if (!isAllowed) {
    console.warn(
      `[RBAC] 🚫 Blocked — Role "${role}" is not permitted to call: ${normalizedUrl}`
    );
  }

  return isAllowed;
}

