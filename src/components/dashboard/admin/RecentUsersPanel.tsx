import { useState } from "react";
import { Text, View } from "react-native";
import UserAvatar from "@/components/ui/UserAvatar";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { DashboardUser } from "@/services/adminDashboardService";
import DashboardRoleBadge from "./DashboardRoleBadge";
import EmptyPanelState from "./EmptyPanelState";
import PanelCard from "./PanelCard";
import StatusDot from "./StatusDot";
import UserActionsMenu from "./UserActionsMenu";
import UserDetailModal from "./UserDetailModal";

type RecentUsersPanelProps = {
  palette: AdminDashboardPalette;
  isDark: boolean;
  users: DashboardUser[];
  /**
   * Stack the role badge and status under the name instead of giving them
   * their own columns — mobile always does, and so does any panel too narrow
   * to leave the name more than a dozen characters.
   */
  compact: boolean;
  onViewAll: () => void;
  fill?: boolean;
};

export default function RecentUsersPanel({
  palette,
  isDark,
  users,
  compact,
  onViewAll,
  fill = false,
}: RecentUsersPanelProps) {
  const [selected, setSelected] = useState<DashboardUser | null>(null);

  return (
    <PanelCard
      palette={palette}
      title="Recent Users"
      onViewAll={onViewAll}
      fill={fill}
    >
      {users.length === 0 ? (
        <EmptyPanelState palette={palette} icon="users" message="No recent users found." />
      ) : (
        <View>
          {users.map((user, index) => (
            <View key={user._id}>
              {index > 0 ? (
                <View className="h-px w-full" style={{ backgroundColor: palette.divider }} />
              ) : null}

              <View className="flex-row items-center gap-3 py-2.5">
                <UserAvatar
                  size={compact ? 38 : 34}
                  imageUrl={user.profilePhoto}
                  accessibilityLabel={`${user.fullname} avatar`}
                  fallbackBackgroundColor={palette.divider}
                  fallbackIconColor={palette.subtle}
                />

                <View className="min-w-0 flex-1">
                  <Text
                    className="text-[13.5px] font-semibold"
                    numberOfLines={1}
                    style={{ color: palette.heading }}
                  >
                    {user.fullname}
                  </Text>
                  {/* numberOfLines + a min-w-0 parent is what truncates long
                      addresses instead of pushing the row off screen. */}
                  <Text
                    className="text-[11.5px]"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ color: palette.muted }}
                  >
                    {user.email}
                  </Text>

                  {compact ? (
                    <View className="mt-1 flex-row items-center gap-2">
                      <DashboardRoleBadge role={user.role} palette={palette} isDark={isDark} />
                      <StatusDot active={user.verified} palette={palette} />
                    </View>
                  ) : null}
                </View>

                {!compact ? (
                  <>
                    <View className="w-[76px] items-center">
                      <DashboardRoleBadge role={user.role} palette={palette} isDark={isDark} />
                    </View>
                    <View className="w-[68px]">
                      <StatusDot active={user.verified} palette={palette} />
                    </View>
                  </>
                ) : null}

                <UserActionsMenu
                  palette={palette}
                  accessibilityLabel={`Actions for ${user.fullname}`}
                  actions={[
                    {
                      label: "View user",
                      icon: "eye",
                      onPress: () => setSelected(user),
                    },
                    {
                      label: "Open User Management",
                      icon: "external-link",
                      onPress: onViewAll,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      )}

      <UserDetailModal
        user={selected}
        palette={palette}
        isDark={isDark}
        onClose={() => setSelected(null)}
        onOpenUserManagement={() => {
          setSelected(null);
          onViewAll();
        }}
      />
    </PanelCard>
  );
}
