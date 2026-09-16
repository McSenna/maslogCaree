import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import type { AdminUser } from "@/features/users/services/userService";
import { formatDateTime } from "@/utils/dateFormatter";
import PlatformAccessBadge from "./PlatformAccessBadge";
import RoleBadge from "./RoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "./usersTheme";

type UserMobileCardProps = {
  user: AdminUser;
  onPress: () => void;
  dense?: boolean;
};

const UserMobileCard = ({ user, onPress, dense = false }: UserMobileCardProps) => {
  const palette = useUsersPalette();
  const lastLogin = formatDateTime(user.lastLogin);
  const hasLoggedIn = Boolean(user.lastLogin);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${user.fullname}`}
      className="w-full flex-row items-center gap-3 border p-3 active:opacity-90"
      style={{
        minHeight: 72,
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <UserAvatar
        size={dense ? 52 : 60}
        imageUrl={user.profilePhoto}
        initials={initialsFrom(user.fullname)}
        accessibilityLabel={`${user.fullname} profile photo`}
        fallbackBackgroundColor={palette.primary}
      />

      <View className="min-w-0 flex-1">
        <View className="flex-row items-start gap-2">
          <View className="min-w-0 flex-1">
            <Text
              className={dense ? "text-[16px] font-bold" : "text-[17px] font-bold"}
              numberOfLines={1}
              style={{ color: palette.heading }}
            >
              {user.fullname}
            </Text>
            <Text
              className={dense ? "mt-0.5 text-[12px]" : "mt-0.5 text-[13px]"}
              numberOfLines={1}
              style={{ color: palette.muted }}
            >
              {user.email}
            </Text>
          </View>

          <Feather
            name="chevron-right"
            size={20}
            color={palette.subtle}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </View>

        <View className="mt-2 flex-row flex-wrap items-center gap-1.5">
          <RoleBadge role={user.role} size="sm" />
          <UserStatusBadge status={user.status} compact />
          <PlatformAccessBadge user={user} size="sm" />
        </View>

        <View className="mt-2 flex-row items-center gap-1.5">
          <Feather name="clock" size={12} color={palette.subtle} />
          <Text className="text-[12px] font-medium" numberOfLines={1} style={{ color: palette.subtle }}>
            {hasLoggedIn ? `${lastLogin.date}  ${lastLogin.time}` : "Never signed in"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default UserMobileCard;
