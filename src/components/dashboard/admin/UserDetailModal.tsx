import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import AppModal from "@/components/ui/Modal";
import UserAvatar from "@/components/ui/UserAvatar";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { DashboardUser } from "@/services/adminDashboardService";
import { describePlatformAccess } from "@/config/platformAccess";
import { formatDate } from "@/utils/dateFormatter";
import DashboardRoleBadge from "./DashboardRoleBadge";
import StatusDot from "./StatusDot";

type UserDetailModalProps = {
  user: DashboardUser | null;
  palette: AdminDashboardPalette;
  isDark: boolean;
  onClose: () => void;
  onOpenUserManagement: () => void;
};

function DetailRow({
  label,
  value,
  palette,
}: {
  label: string;
  value: string;
  palette: AdminDashboardPalette;
}) {
  return (
    <View className="gap-0.5">
      <Text className="text-[11px] font-semibold uppercase" style={{ color: palette.subtle, letterSpacing: 0.6 }}>
        {label}
      </Text>
      <Text className="text-[13.5px] font-medium" style={{ color: palette.body }}>
        {value}
      </Text>
    </View>
  );
}

/**
 * Read-only detail sheet for a row in Recent Users.
 *
 * It renders from the dashboard payload already in memory, so opening it costs
 * no extra request.
 */
export default function UserDetailModal({
  user,
  palette,
  isDark,
  onClose,
  onOpenUserManagement,
}: UserDetailModalProps) {
  if (!user) return null;

  return (
    <AppModal
      visible={Boolean(user)}
      onClose={onClose}
      contentClassName="w-[92%] max-w-md"
    >
      <View
        className="gap-4 rounded-2xl border p-5"
        style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}
      >
        <View className="flex-row items-start gap-3">
          <UserAvatar
            size={48}
            imageUrl={user.profilePhoto}
            accessibilityLabel={`${user.fullname} avatar`}
            fallbackBackgroundColor={palette.divider}
            fallbackIconColor={palette.subtle}
          />
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-[16px] font-bold" style={{ color: palette.heading }} numberOfLines={2}>
              {user.fullname}
            </Text>
            <Text className="text-[12.5px]" style={{ color: palette.muted }} numberOfLines={1}>
              {user.email}
            </Text>
            <View className="flex-row items-center gap-2">
              <DashboardRoleBadge role={user.role} palette={palette} isDark={isDark} />
              <StatusDot active={user.verified} palette={palette} />
            </View>
          </View>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close user details"
            hitSlop={10}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Feather name="x" size={20} color={palette.muted} />
          </Pressable>
        </View>

        <View className="h-px w-full" style={{ backgroundColor: palette.divider }} />

        <View className="gap-3">
          <DetailRow label="Account status" value={user.verified ? "Active" : "Inactive"} palette={palette} />
          <DetailRow
            label="Platform access"
            value={
              describePlatformAccess(user.role).web
                ? "Web + Mobile"
                : "Mobile application only"
            }
            palette={palette}
          />
          <DetailRow label="Registered" value={formatDate(user.createdAt)} palette={palette} />
        </View>

        <Pressable
          onPress={onOpenUserManagement}
          accessibilityRole="button"
          className="items-center rounded-xl px-4 py-3"
          style={({ pressed }) => ({
            backgroundColor: palette.primary,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text className="text-[13.5px] font-semibold text-white">Manage in User Management</Text>
        </Pressable>
      </View>
    </AppModal>
  );
}
