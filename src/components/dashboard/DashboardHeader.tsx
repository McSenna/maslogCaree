import { Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";

type ResidentHeaderProps = {
  greeting: string;
  userName: string;
  avatarUrl?: string | null;
  tagline?: string;
};

type DashboardHeaderProps = {
  title?: string;
  subtitle?: string;
  roleBadge?: string;
  resident?: ResidentHeaderProps;
};

export default function DashboardHeader({
  title,
  subtitle,
  roleBadge,
  resident,
}: DashboardHeaderProps) {
  const { classes } = useTheme();

  return (
    <View className="gap-4">
      {resident ? (
        <View className="flex-row items-center gap-3">
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
        </View>
      ) : (
        <View className="flex-row flex-wrap items-start gap-3">
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
        </View>
      )}
    </View>
  );
}
