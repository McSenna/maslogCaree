import type { Feather } from "@expo/vector-icons";
import { PALETTE } from "@/theme/palette";

/** Icon and colours for a system-log action. Tints are for light cards; dark cards use a wash of `color`. */
export type ActivityVisual = { icon: keyof typeof Feather.glyphMap; color: string; tint: string };

export const activityVisual = (action: string): ActivityVisual => {
  switch (action) {
    case "LOGIN":
      return { icon: "log-in", color: PALETTE.success[600], tint: PALETTE.success[50] };
    case "LOGOUT":
      return { icon: "log-out", color: PALETTE.slate[500], tint: PALETTE.slate[100] };
    case "LOGIN_FAILED":
      return { icon: "alert-triangle", color: PALETTE.red[600], tint: PALETTE.red[100] };
    case "RESIDENT_WEB_LOGIN_BLOCKED":
    case "PLATFORM_ACCESS_DENIED":
      return { icon: "smartphone", color: PALETTE.amber[600], tint: PALETTE.amber[100] };
    case "USER_CREATED":
      return { icon: "user-plus", color: PALETTE.blue[600], tint: PALETTE.blue[50] };
    case "USER_UPDATED":
      return { icon: "edit-2", color: PALETTE.blue[600], tint: PALETTE.blue[50] };
    case "USER_DELETED":
      return { icon: "user-x", color: PALETTE.red[600], tint: PALETTE.red[100] };
    case "USER_ROLE_CHANGED":
      return { icon: "shuffle", color: PALETTE.blue[600], tint: PALETTE.blue[100] };
    case "USER_VERIFIED":
      return { icon: "user-check", color: PALETTE.success[600], tint: PALETTE.success[50] };
    case "USER_UNVERIFIED":
      return { icon: "user-minus", color: PALETTE.slate[500], tint: PALETTE.slate[100] };
    case "RECORD_CREATED":
    case "RECORD_UPDATED":
    case "RECORD_VIEWED":
      return { icon: "file-text", color: PALETTE.blue[600], tint: PALETTE.blue[50] };
    case "SCHEDULE_CREATED":
    case "SCHEDULE_UPDATED":
    case "SCHEDULE_DELETED":
      return { icon: "calendar", color: PALETTE.amber[600], tint: PALETTE.amber[100] };
    case "ANNOUNCEMENT_CREATED":
    case "ANNOUNCEMENT_UPDATED":
    case "ANNOUNCEMENT_DELETED":
      return { icon: "volume-2", color: PALETTE.blue[600], tint: PALETTE.blue[50] };
    default:
      return { icon: "activity", color: PALETTE.blue[600], tint: PALETTE.blue[100] };
  }
};
