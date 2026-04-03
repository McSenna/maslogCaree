import { Feather } from "@expo/vector-icons";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";
import NotificationPanel, { type NotificationItem } from "./NotificationPanel";

type ResidentHeaderProps = {
  greeting: string;
  userName: string;
  avatarUrl?: string | null;
  tagline?: string;
};

type DashboardHeaderProps = {
  /** Staff / legacy layout */
  title?: string;
  subtitle?: string;
  roleBadge?: string;
  /** Resident layout — greeting row + avatar + bell */
  resident?: ResidentHeaderProps;
  notifications?: NotificationItem[];
  right?: ReactNode;
};

export default function DashboardHeader({
  title,
  subtitle,
  roleBadge,
  resident,
  notifications = [],
  right,
}: DashboardHeaderProps) {
  const { resolvedTheme, classes } = useTheme();
  const [open, setOpen] = useState(false);
  const iconColor = resolvedTheme === "dark" ? "#e2e8f0" : "#0f172a";
  const unread = notifications.length;

  const bell = (
    <View className="flex-row items-center gap-2">
      {right}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open notifications"
        onPress={() => setOpen(true)}
        className={["relative h-10 w-10 items-center justify-center rounded-2xl", classes.toolbarIcon].join(
          " "
        )}
        style={({ pressed }) => ({
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Feather name="bell" size={20} color={iconColor} />
        {unread > 0 ? (
          <View className="absolute -right-0.5 -top-0.5 min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1">
            <Text className="text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );

  return (
    <View className="gap-4">
      {resident ? (
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1 flex-row items-center gap-3">
            <ProfileAvatar size={52} imageUrl={resident.avatarUrl ?? null} verified={false} />
            <View className="min-w-0 flex-1">
              <Text className={`text-xs font-semibold uppercase tracking-wider ${classes.textMuted}`}>
                {resident.greeting}
              </Text>
              <Text className={`text-xl font-bold ${classes.textPrimary}`} numberOfLines={1}>
                {resident.userName}
              </Text>
              {resident.tagline ? (
                <Text className={`mt-0.5 text-sm ${classes.textMuted}`} numberOfLines={2}>
                  {resident.tagline}
                </Text>
              ) : null}
            </View>
          </View>
          {bell}
        </View>
      ) : (
        <View className="flex-row flex-wrap items-start justify-between gap-3">
          <View className="min-w-0 flex-1">
            <View className="mb-1 flex-row flex-wrap items-center gap-2">
              {title ? <PageTitle>{title}</PageTitle> : null}
              {roleBadge ? (
                <View className={classes.chip}>
                  <Text className={classes.chipText}>{roleBadge}</Text>
                </View>
              ) : null}
            </View>
            {subtitle ? <PageSubtitle>{subtitle}</PageSubtitle> : null}
          </View>
          {bell}
        </View>
      )}

      <NotificationPanel
        visible={open}
        onClose={() => setOpen(false)}
        items={notifications}
      />
    </View>
  );
}
