export { default as UserProfileScreen } from "./screens/UserProfileScreen";
export { default as ProfileModal } from "./modals/ProfileModal";

export { useProfile } from "./hooks/useProfile";
export type { ProfileState } from "./hooks/useProfile";

export {
  PROFILE_ROLE_CONFIG,
  getProfileRoleConfig,
  PROFILE_FIELDS,
} from "./config/profileRoleConfig";
export type {
  ProfileRoleConfig,
  ProfileFieldKey,
  RoleBadgeStyle,
} from "./config/profileRoleConfig";

export {
  PROFILE_COLORS,
  PROFILE_RADIUS,
  PROFILE_SHADOW,
  PROFILE_TYPE,
} from "./config/profileTheme";

export { buildProfileData, buildDisplayId, getInitials } from "./utils/profileData";
export type { ProfileData, ProfileField } from "./utils/profileData";
