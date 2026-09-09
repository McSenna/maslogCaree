import { Platform } from "react-native";
import type { UserRole } from "@/data/mockUsers";

export type ClientPlatform = "web" | "mobile";

export const CLIENT_PLATFORM: ClientPlatform = Platform.OS === "web" ? "web" : "mobile";

export const IS_WEB_PLATFORM = CLIENT_PLATFORM === "web";

export const PLATFORM_ACCESS: Record<UserRole, ClientPlatform[]> = {
  admin: ["web", "mobile"],
  doctor: ["web", "mobile"],
  midwife: ["web", "mobile"],
  bhw: ["web", "mobile"],
  resident: ["mobile"],
};

const FALLBACK_ALLOWED: ClientPlatform[] = ["mobile"];

export const getAllowedPlatforms = (role: string | null | undefined): ClientPlatform[] => {
  const key = typeof role === "string" ? (role.trim().toLowerCase() as UserRole) : null;
  return (key && PLATFORM_ACCESS[key]) || FALLBACK_ALLOWED;
};

export const isPlatformAllowed = (
  role: string | null | undefined,
  platform: ClientPlatform = CLIENT_PLATFORM
): boolean => getAllowedPlatforms(role).includes(platform);

export const isBlockedOnThisPlatform = (role: string | null | undefined): boolean =>
  !isPlatformAllowed(role, CLIENT_PLATFORM);

export interface PlatformAccessSummary {
  allowedPlatforms: ClientPlatform[];
  web: boolean;
  mobile: boolean;
  label: string;
}

export const describePlatformAccess = (
  role: string | null | undefined
): PlatformAccessSummary => {
  const allowedPlatforms = getAllowedPlatforms(role);
  const web = allowedPlatforms.includes("web");
  const mobile = allowedPlatforms.includes("mobile");

  return {
    allowedPlatforms: [...allowedPlatforms],
    web,
    mobile,
    label: web && mobile ? "Web + Mobile" : mobile ? "Mobile Only" : "Web Only",
  };
};

export const MOBILE_ONLY_NOTICE = {
  title: "Mobile App Required",
  message:
    "Resident accounts cannot access MaslogCare through the web platform.\n\nPlease use the MaslogCare mobile application to continue.",
  supporting:
    "MaslogCare Resident services are available exclusively through the mobile application.",
  action: "Got It",
} as const;
