import { Text, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type DashboardIntroProps = {
  palette: AdminDashboardPalette;
  compact: boolean;
};

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Administrators are greeted by role rather than by name: the seeded operator
 * account is literally "System Administrator", and "Good day, System!" reads as
 * a bug. Any other signed-in role gets its own first name.
 */
function greetingName(name?: string | null, role?: string | null): string {
  if (role === "admin") return "Admin";
  const first = (name ?? "").trim().split(/\s+/)[0];
  return first.length > 0 ? first : "Admin";
}

export default function DashboardIntro({ palette, compact }: DashboardIntroProps) {
  const { user } = useAuth();

  // Rendered from the device clock on every mount so the dashboard never shows
  // a stale or baked-in date.
  const today = new Date().toLocaleDateString(undefined, DATE_OPTS);
  const greeting = `Good day, ${greetingName(user?.name, user?.role)}!`;

  if (compact) {
    return (
      <View className="gap-1">
        <Text
          className="text-[11px] font-semibold uppercase"
          style={{ color: palette.primary, letterSpacing: 1.2 }}
        >
          Dashboard
        </Text>
        <Text className="text-[23px] font-bold" style={{ color: palette.heading }}>
          System Overview
        </Text>
        <Text className="text-[13px] font-medium" style={{ color: palette.muted }}>
          {greeting}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-start justify-between gap-6">
      <View className="min-w-0 flex-1 gap-1">
        <Text
          className="text-[11px] font-semibold uppercase"
          style={{ color: palette.primary, letterSpacing: 1.4 }}
        >
          Dashboard
        </Text>
        <Text
          className="text-[30px] font-bold"
          style={{ color: palette.heading, lineHeight: 38 }}
        >
          System Overview
        </Text>
        <Text className="text-[14px] font-medium" style={{ color: palette.muted }}>
          Manage users, monitor activities, and keep your community healthy.
        </Text>
      </View>

      <View className="shrink-0 items-end gap-1 pt-1">
        <Text className="text-right text-[13px] font-semibold" style={{ color: palette.body }}>
          {today}
        </Text>
        <Text className="text-right text-[13px] font-medium" style={{ color: palette.muted }}>
          {greeting}
        </Text>
      </View>
    </View>
  );
}
