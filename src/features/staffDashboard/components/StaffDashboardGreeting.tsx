import { Text, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { RoleDashboardConfig } from "../config/roleDashboardConfig";

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

const timeOfDay = (now: Date): string => {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const displayName = (fullname: string | null | undefined, role: string, badge: string): string => {
  const parts = (fullname ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return badge;

  if (role === "doctor") {
    const surname = parts[parts.length - 1];
    return `Dr. ${surname}`;
  }
  return parts[0];
};

const StaffDashboardGreeting = ({
  palette,
  config,
  compact,
}: {
  palette: AdminDashboardPalette;
  config: RoleDashboardConfig;
  compact: boolean;
}) => {
  const { user } = useAuth();

  const now = new Date();
  const today = now.toLocaleDateString(undefined, DATE_OPTS);
  const name = displayName(user?.name, config.role, config.badge);

  return (
    <View className="w-full flex-row items-start justify-between gap-3">
      <View className="min-w-0 flex-1 gap-1">
        <Text
          className="text-[11px] font-bold uppercase"
          style={{ color: palette.primary, letterSpacing: 1.2 }}
        >
          {config.badge} Dashboard
        </Text>
        <Text
          className={compact ? "text-[21px] font-bold" : "text-[24px] font-bold"}
          style={{ color: palette.heading }}
        >
          {timeOfDay(now)}, {name}
        </Text>
        <Text className="text-[13px] font-medium" style={{ color: palette.muted }}>
          {config.tagline}
        </Text>
      </View>

      {!compact ? (
        <View
          className="shrink-0 rounded-xl px-3 py-2"
          style={{ backgroundColor: palette.bannerBg, borderWidth: 1, borderColor: palette.bannerBorder }}
        >
          <Text className="text-[12.5px] font-semibold" style={{ color: palette.primary }}>
            {today}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default StaffDashboardGreeting;
