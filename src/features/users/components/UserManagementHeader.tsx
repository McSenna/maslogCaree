import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useUsersPalette } from "./usersTheme";

type UserManagementHeaderProps = {
  /** Mobile drops the eyebrow and the tagline, keeping only title + subtitle. */
  compact?: boolean;
};

/**
 * Page masthead: eyebrow, title, subtitle on the left; the MaslogCare tagline
 * on the right. The tagline is decorative, so it is the first thing dropped
 * when the row gets tight.
 */
export default function UserManagementHeader({ compact = false }: UserManagementHeaderProps) {
  const palette = useUsersPalette();

  return (
    <View className="w-full flex-row items-start justify-between gap-4">
      <View className="min-w-0 flex-1">
        {!compact && (
          <View className="flex-row items-center gap-1.5">
            <Feather name="users" size={11} color={palette.subtle} />
            <Text
              className="text-[11px] font-semibold uppercase"
              style={{ color: palette.subtle, letterSpacing: 1.2 }}
            >
              Users
            </Text>
          </View>
        )}

        <Text
          accessibilityRole="header"
          className={compact ? "text-[28px] font-extrabold" : "mt-1.5 text-[38px] font-extrabold"}
          style={{ color: palette.heading, lineHeight: compact ? 34 : 44, letterSpacing: -0.6 }}
        >
          User Management
        </Text>

        <Text
          className={compact ? "mt-1 text-[13px] font-medium" : "mt-1.5 text-[16px] font-medium"}
          style={{ color: palette.muted }}
        >
          Manage system users, their roles, and access across MaslogCare.
        </Text>
      </View>

      {!compact && (
        <Text
          className="mt-1 shrink-0 text-[13px] font-medium italic"
          style={{ color: palette.subtle }}
        >
          People • Care • Community
        </Text>
      )}
    </View>
  );
}
