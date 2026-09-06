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

type UserCardProps = {
  user: AdminUser;
};

function Field({ label, value }: { label: string; value: string }) {
  const { classes } = useTheme();
  return (
    <View className="flex-row gap-1.5">
      <Text className={`w-28 shrink-0 text-xs font-medium ${classes.textMuted}`}>
        {label}
      </Text>
      <Text
        className={`flex-1 text-xs ${classes.textSecondary}`}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

export default function UserCard({ user }: UserCardProps) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const createdAt = formatDateTime(user.createdAt);
  const updatedAt = formatDateTime(user.updatedAt);

  return (
    <View
      className={[
        "rounded-2xl border p-4 gap-3",
        classes.border,
        isDark ? "bg-slate-900/80" : "bg-white",
      ].join(" ")}
    >
      {/* Header row */}
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text
            className={`text-sm font-bold ${classes.textPrimary}`}
            numberOfLines={1}
          >
            {user.fullname}
          </Text>
          <Text
            className={`mt-0.5 text-xs ${classes.textMuted}`}
            numberOfLines={1}
          >
            {user.email}
          </Text>
        </View>
        <RoleBadge role={user.role} size="sm" />
      </View>

      {/* Details */}
      <View className="gap-1.5">
        <Field label="Gender" value={GENDER_LABELS[user.gender] ?? user.gender} />
        <Field label="Date of Birth" value={formatDate(user.dateOfBirth)} />
        <Field label="Address" value={user.address} />
        <Field
          label="Created"
          value={`${createdAt.date}${createdAt.time ? `  ${createdAt.time}` : ""}`}
        />
        <Field
          label="Updated"
          value={`${updatedAt.date}${updatedAt.time ? `  ${updatedAt.time}` : ""}`}
        />
      </View>

      {/* Verified indicator */}
      <View className="flex-row items-center gap-1.5">
        <View
          className={`h-1.5 w-1.5 rounded-full ${user.verified ? "bg-emerald-500" : "bg-slate-400"}`}
        />
        <Text className={`text-[10px] font-medium ${classes.textMuted}`}>
          {user.verified ? "Verified" : "Unverified"}
        </Text>
      </View>
    </View>
  );
}
