export type PermissionProfile = { user?: { _id?: string; permissions?: { manageResidentWebAccess?: boolean } } };

export const permissionForAccount = (accountId: string | null, profile: PermissionProfile | null): boolean =>
  accountId !== null && profile?.user?._id === accountId &&
  profile.user.permissions?.manageResidentWebAccess === true;
