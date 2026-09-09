import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import type { AdminUser } from "@/services/userService";
import { formatDateTime } from "@/utils/dateFormatter";
import PlatformAccessBadge from "./PlatformAccessBadge";
import RoleBadge from "./RoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "./usersTheme";

type UserMobileCardProps = {
  user: AdminUser;
  onPress: () => void;
  /** Narrowest phones (320–360px) trim the avatar so the badges still fit. */
  dense?: boolean;
};

/**
 * One user as a card — the phone equivalent of a table row.
 *
 * The table is not shrunk down: at 360–430px the eight columns would either
 * overflow or clip, so the same fields are re-laid out with the avatar
 * anchoring the card and the last login on its own line.
 *
 * The whole card is the target and a chevron says so, rather than a per-row
 * menu: every action the menu held now lives in the details sheet the card
 * opens, which is the same trade Inventory makes on a phone. One tap to the
 * record, and no 24px menu button to hit next to a 300px card.
 */
export default function UserMobileCard({ user, onPress, dense = false }: UserMobileCardProps) {
  const palette = useUsersPalette();
  const lastLogin = formatDateTime(user.lastLogin);
  const hasLoggedIn = Boolean(user.lastLogin);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${user.fullname}`}
      // A function-form `style` is dropped by react-native-web, so the card's
      // surface is a plain object and the press state rides on the class.
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

          {/* Decorative: the card itself carries the button role and label. */}
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
}
