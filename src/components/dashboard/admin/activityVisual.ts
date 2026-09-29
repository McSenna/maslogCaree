import type { Feather } from "@expo/vector-icons";
import { PALETTE } from "@/theme/palette";

/** Icon and colours for a system-log action. Tints are for light cards; dark cards use a wash of `color`. */
export type ActivityVisual = { icon: keyof typeof Feather.glyphMap; color: string; tint: string };

export const activityVisual = (action: string): ActivityVisual => {
  switch (action) {
    case "LOGIN":
      return { icon: "log-in", color: "#22C55E", tint: "#E3FBEC" };
    case "LOGOUT":
      return { icon: "log-out", color: "#64748B", tint: "#EEF2F7" };
    case "LOGIN_FAILED":
      return { icon: "alert-triangle", color: "#F43F5E", tint: "#FFE4E9" };
    case "RESIDENT_WEB_LOGIN_BLOCKED":
    case "PLATFORM_ACCESS_DENIED":
      return { icon: "smartphone", color: "#F59E0B", tint: "#FEF3C7" };
    case "USER_CREATED":
      return { icon: "user-plus", color: PALETTE.blue[600], tint: "#E5F0FF" };
    case "USER_UPDATED":
      return { icon: "edit-2", color: PALETTE.blue[600], tint: "#E5F0FF" };
    case "USER_DELETED":
      return { icon: "user-x", color: "#F43F5E", tint: "#FFE4E9" };
    case "USER_ROLE_CHANGED":
      return { icon: "shuffle", color: "#8B5CF6", tint: "#F0EBFE" };
    case "USER_VERIFIED":
      return { icon: "user-check", color: "#22C55E", tint: "#E3FBEC" };
    case "USER_UNVERIFIED":
      return { icon: "user-minus", color: "#64748B", tint: "#EEF2F7" };
    case "RECORD_CREATED":
    case "RECORD_UPDATED":
    case "RECORD_VIEWED":
      return { icon: "file-text", color: PALETTE.blue[600], tint: "#E5F0FF" };
    case "SCHEDULE_CREATED":
    case "SCHEDULE_UPDATED":
    case "SCHEDULE_DELETED":
      return { icon: "calendar", color: "#F59E0B", tint: "#FDF1DC" };
    case "ANNOUNCEMENT_CREATED":
      return { icon: "volume-2", color: PALETTE.blue[600], tint: "#E5F0FF" };
    default:
      return { icon: "activity", color: "#8B5CF6", tint: "#F0EBFE" };
  }
};
