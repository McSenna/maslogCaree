import { Text, View } from "react-native";
import UserAvatar from "@/components/ui/UserAvatar";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { DashboardUser } from "@/services/adminDashboardService";
import DashboardRoleBadge from "./DashboardRoleBadge";
import EmptyPanelState from "./EmptyPanelState";
import PanelCard from "./PanelCard";
import StatusDot from "./StatusDot";

type RecentUsersPanelProps = {
  palette: AdminDashboardPalette;
  isDark: boolean;
  users: DashboardUser[];
  compact: boolean;
  onViewAll: () => void;
  fill?: boolean;
};

const ROLE_COLUMN = 84;
const STATUS_COLUMN = 76;
const JOINED_COLUMN = 64;

const joinedLabel = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const ColumnHeader = ({
  palette,
  label,
  width,
  align = "left",
}: {
  palette: AdminDashboardPalette;
  label: string;
  width?: number;
  align?: "left" | "right";
}) => (
  <Text
    className="text-[11px] font-bold uppercase"
    numberOfLines={1}
    style={{
      color: palette.subtle,
      letterSpacing: 0.6,
      width,
      flex: width ? undefined : 1,
      textAlign: align,
    }}
  >
    {label}
  </Text>
);

const RecentUsersPanel = ({
  palette,
  isDark,
  users,
  compact,
  onViewAll,
  fill = false,
}: RecentUsersPanelProps) => {
  return (
    <PanelCard
      palette={palette}
      title="Recent Users"
      icon="users"
      subtitle="Newest accounts first"
      onViewAll={onViewAll}
      fill={fill}
    >
      {users.length === 0 ? (
        <EmptyPanelState palette={palette} icon="users" message="No recent users found." />
      ) : (
        <View>
          {!compact ? (
            <View
              className="flex-row items-center gap-3 rounded-lg px-2 py-2"
              style={{ backgroundColor: palette.divider }}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <ColumnHeader palette={palette} label="User" />
              <ColumnHeader palette={palette} label="Role" width={ROLE_COLUMN} />
              <ColumnHeader palette={palette} label="Status" width={STATUS_COLUMN} />
              <ColumnHeader palette={palette} label="Joined" width={JOINED_COLUMN} align="right" />
            </View>
          ) : null}
          {users.map((user, index) => (
            <View key={user._id}>
              {index > 0 ? (
                <View className="h-px w-full" style={{ backgroundColor: palette.divider }} />
              ) : null}

              <View
                className={`flex-row items-center gap-3 ${compact ? "py-2.5" : "px-2 py-2"}`}
                accessible
                accessibilityLabel={`${user.fullname}, ${user.email}, ${user.role}, ${user.verified ? "active" : "inactive"}, joined ${joinedLabel(user.createdAt)}`}
              >
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
                    <View style={{ width: ROLE_COLUMN }} className="items-start">
                      <DashboardRoleBadge role={user.role} palette={palette} isDark={isDark} />
                    </View>
                    <View style={{ width: STATUS_COLUMN }}>
                      <StatusDot active={user.verified} palette={palette} />
                    </View>
                    <Text
                      className="text-right text-[12px] font-medium"
                      numberOfLines={1}
                      style={{ width: JOINED_COLUMN, color: palette.muted, fontVariant: ["tabular-nums"] }}
                    >
                      {joinedLabel(user.createdAt)}
                    </Text>
                  </>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}
    </PanelCard>
  );
};

export default RecentUsersPanel;
