import { Text, View } from "react-native";
import type { AdminUser } from "@/services/userService";
import { useTheme } from "@/contexts/ThemeContext";
import RoleBadge from "./RoleBadge";
import { formatDate, formatDateTime } from "@/utils/dateFormatter";

const GENDER_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

type UserTableRowProps = {
  user: AdminUser;
  isEven: boolean;
};

function Cell({
  children,
  flex,
  className = "",
}: {
  children: React.ReactNode;
  flex?: number;
  className?: string;
}) {
  return (
    <View
      className={`px-3 py-3 ${className}`}
      style={flex !== undefined ? { flex } : undefined}
    >
      {children}
    </View>
  );
}

export default function UserTableRow({ user, isEven }: UserTableRowProps) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const rowBg = isEven
    ? isDark
      ? "bg-slate-900/40"
      : "bg-slate-50/70"
    : isDark
      ? "bg-slate-900/80"
      : "bg-white";

  const created = formatDateTime(user.createdAt);
  const updated = formatDateTime(user.updatedAt);

  return (
    <View className={`flex-row border-b ${classes.border} ${rowBg}`}>
      {/* Full Name */}
      <Cell flex={3}>
        <Text
          className={`text-xs font-semibold ${classes.textPrimary}`}
          numberOfLines={1}
        >
          {user.fullname}
        </Text>
        <Text
          className={`mt-0.5 text-[10px] ${classes.textMuted}`}
          numberOfLines={1}
        >
          {user.email}
        </Text>
      </Cell>

      {/* Gender */}
      <Cell flex={1.5}>
        <Text className={`text-xs ${classes.textSecondary}`}>
          {GENDER_LABELS[user.gender] ?? user.gender}
        </Text>
      </Cell>

      {/* Address */}
      <Cell flex={3}>
        <Text
          className={`text-xs ${classes.textSecondary}`}
          numberOfLines={2}
        >
          {user.address}
        </Text>
      </Cell>

      {/* Role */}
      <Cell flex={2}>
        <RoleBadge role={user.role} />
      </Cell>

      {/* Date of Birth */}
      <Cell flex={2}>
        <Text className={`text-xs ${classes.textSecondary}`}>
          {formatDate(user.dateOfBirth)}
        </Text>
      </Cell>

      {/* Created At */}
      <Cell flex={2}>
        <Text className={`text-[10px] font-medium ${classes.textSecondary}`}>
          {created.date}
        </Text>
        {created.time ? (
          <Text className={`text-[10px] ${classes.textMuted}`}>{created.time}</Text>
        ) : null}
      </Cell>

      {/* Updated At */}
      <Cell flex={2}>
        <Text className={`text-[10px] font-medium ${classes.textSecondary}`}>
          {updated.date}
        </Text>
        {updated.time ? (
          <Text className={`text-[10px] ${classes.textMuted}`}>{updated.time}</Text>
        ) : null}
      </Cell>
    </View>
  );
}
