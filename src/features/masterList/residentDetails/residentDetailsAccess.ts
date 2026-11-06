// Mirrors the server: every /admin/master-residents route, including PATCH, is
// admin-only (backend/routes/masterResidentRoutes.js). This only hides the
// button; the server still refuses anyone else.
const EDITOR_ROLES: readonly string[] = ["admin"];

export const canEditResidentRecord = (role: string | null | undefined): boolean =>
  typeof role === "string" && EDITOR_ROLES.includes(role.trim().toLowerCase());
