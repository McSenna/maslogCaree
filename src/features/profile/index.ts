export { default as UserProfileScreen } from "./screens/UserProfileScreen";
export { default as ProfileModal } from "./modals/ProfileModal";

export { useProfile } from "./hooks/useProfile";
export type { ProfileState } from "./hooks/useProfile";
export { useProfileScreen } from "./hooks/useProfileScreen";
export type { ProfileScreenState } from "./hooks/useProfileScreen";

export { PROFILE_ROLE_CONFIG, getProfileRoleConfig } from "./config/profileRoleConfig";
export type { ProfileRoleConfig } from "./config/profileRoleConfig";

export { buildProfileData } from "./utils/profileData";
export type { ProfileData } from "./utils/profileData";
export { buildDisplayId, getInitials } from "./utils/profileHelpers";
export { buildProfileSections } from "./utils/buildProfileSections";
export type { ProfileSection } from "./utils/buildProfileSections";
