export type PermissionProfile = { user?: { _id?: string; permissions?: { manageResidentWebAccess?: boolean } } };

export type PermissionStatus = "checking" | "granted" | "denied" | "unavailable";

/** Only "granted" shows controls. "unavailable" means the server gave no usable answer, which is not a denial. */
export const permissionStatus = (accountId: string | null, profile: PermissionProfile | null, requestFailed: boolean): PermissionStatus => {
  if (accountId === null) return "denied";
  if (requestFailed) return "unavailable";
  if (profile === null) return "checking";
  const allowed = profile.user?.permissions?.manageResidentWebAccess;
  if (profile.user?._id !== accountId || typeof allowed !== "boolean") return "unavailable";
  return allowed ? "granted" : "denied";
};
