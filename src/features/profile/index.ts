export { default as UserProfileScreen } from "./screens/UserProfileScreen";
export { default as ProfileModal } from "./modals/ProfileModal";

export { useProfile } from "./hooks/useProfile";
export type { ProfileState } from "./hooks/useProfile";
export { useProfileScreen } from "./hooks/useProfileScreen";
export type { ProfileScreenState } from "./hooks/useProfileScreen";
export { useProfileInsights } from "./hooks/useProfileInsights";
export { useProfileTabs } from "./hooks/useProfileTabs";

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
  PROFILE_TAB_DEFINITIONS,
  getProfileTabsForRole,
  isResidentRole,
} from "./config/profileTabs";
export type { ProfileTabDefinition } from "./config/profileTabs";

export {
  PROFILE_COLORS,
  PROFILE_RADIUS,
  PROFILE_SHADOW,
  PROFILE_TYPE,
} from "./config/profileTheme";
export { SOCIAL_COLORS, PROFILE_MAX_WIDTH } from "./config/profileSocialTheme";

export { buildProfileData, buildDisplayId, getInitials } from "./utils/profileData";
export type { ProfileData, ProfileField } from "./utils/profileData";
export { buildProfileGroups } from "./utils/profileGroups";

export type {
  ProfileActivityItem,
  ProfileInfoGroup,
  ProfileInsights,
  ProfileInsightsState,
  ProfileStat,
  ProfileTabKey,
} from "./types/profile.types";
