import { Text, View } from "react-native";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import type { AdminUser } from "@/services/userService";
import PlatformAccessBadge from "../PlatformAccessBadge";
import RoleBadge from "../RoleBadge";
import UserStatusBadge from "../UserStatusBadge";
import { useUserDetailsPalette } from "./detailsTheme";

/**
 * Who this account belongs to — the phone presentation.
 *
 * Deliberately not the desktop hero: on a phone the sheet's vertical space is
 * the scarce resource, so the branding, artwork and tagline all come off and
 * what stays is the face, the name and the three badges an admin actually
 * scans for. Roughly a third of the hero's height, for all of its information.
 */
export default function UserProfileSummary({ user }: { user: AdminUser }) {
  const palette = useUserDetailsPalette();
  const isActive = user.status === "active";

  return (
    <View className="w-full items-center px-4 pb-1 pt-2">
      <View>
        <View
          style={{
            borderRadius: 9999,
            borderWidth: 3,
            borderColor: palette.avatarRing,
            shadowColor: "#0F2557",
            shadowOpacity: 0.14,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          <UserAvatar
            size={80}
            imageUrl={user.profilePhoto}
            initials={initialsFrom(user.fullname)}
            accessibilityLabel={`${user.fullname} profile photo`}
            fallbackBackgroundColor={palette.primary}
          />
        </View>

        {isActive ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={{
              position: "absolute",
              right: 2,
              bottom: 2,
              height: 16,
              width: 16,
              borderRadius: 8,
              borderWidth: 2.5,
              borderColor: palette.avatarRing,
              backgroundColor: palette.statusActive,
            }}
          />
        ) : null}
      </View>

      <Text
        className="mt-3 text-center text-[19px] font-bold"
        numberOfLines={2}
        style={{ color: palette.heading }}
      >
        {user.fullname}
      </Text>
      <Text className="mt-0.5 text-center text-[13px]" numberOfLines={1} style={{ color: palette.muted }}>
        {user.email}
      </Text>

      <View className="mt-3 flex-row flex-wrap items-center justify-center gap-1.5">
        <RoleBadge role={user.role} size="sm" />
        <UserStatusBadge status={user.status} compact />
        <PlatformAccessBadge user={user} size="sm" />
      </View>
    </View>
  );
}
