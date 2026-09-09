import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import MaslogCareLogo from "@/components/landing/MaslogCareLogo";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import type { AdminUser } from "@/services/userService";
import PlatformAccessBadge from "../PlatformAccessBadge";
import RoleBadge from "../RoleBadge";
import UserStatusBadge from "../UserStatusBadge";
import { DETAIL_RADIUS, HERO_TAGLINE, useUserDetailsPalette } from "./detailsTheme";

/**
 * The healthcare motif behind the hero: a pale hill line and a faint heart.
 *
 * Kept at a whisper — the name, badges and branding all sit on top of it, and
 * the moment the artwork competes with them the card stops being a header and
 * starts being a picture.
 */
function HeroDecor({ tint, soft }: { tint: string; soft: string }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ position: "absolute", right: 0, top: 0, bottom: 0, left: 0, pointerEvents: "none" }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 900 210" preserveAspectRatio="xMaxYMid slice">
        <Path d="M470 210 L610 118 L742 210 Z" fill={tint} opacity={0.28} />
        <Path d="M640 210 L790 96 L900 178 L900 210 Z" fill={soft} opacity={0.5} />
        <Circle cx={868} cy={44} r={54} fill={soft} opacity={0.35} />
        <Path
          d="M300 196 c0 -14 12 -22 20 -12 c6 -14 22 -8 22 4 c0 18 -21 32 -21 32 s-21 -14 -21 -24 Z"
          fill={tint}
          opacity={0.22}
        />
      </Svg>
    </View>
  );
}

type UserProfileHeroProps = {
  user: AdminUser;
  /** Below this the hero stacks: branding drops under the identity block. */
  compact: boolean;
};

/**
 * Who this account belongs to, answered before anything else on the dialog.
 *
 * Everything an administrator needs in the first two seconds lives here —
 * face, name, role, standing and which clients the account can sign in from —
 * so the cards underneath are detail rather than discovery.
 */
export default function UserProfileHero({ user, compact }: UserProfileHeroProps) {
  const palette = useUserDetailsPalette();
  const avatarSize = compact ? 96 : 120;
  const isActive = user.status === "active";

  return (
    <LinearGradient
      colors={[palette.heroTop, palette.heroBottom]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: DETAIL_RADIUS.hero,
        borderWidth: 1,
        borderColor: palette.heroBorder,
        overflow: "hidden",
      }}
    >
      <HeroDecor tint={palette.bannerArt} soft={palette.bannerArtSoft} />

      <View
        className={`${compact ? "flex-col items-center gap-5" : "flex-row items-center"} p-6`}
      >
        {/* Identity */}
        <View
          className={`${compact ? "flex-col items-center gap-4" : "min-w-0 flex-1 flex-row items-center gap-5"}`}
        >
          <View>
            <View
              style={{
                borderRadius: 9999,
                borderWidth: 4,
                borderColor: palette.avatarRing,
                shadowColor: "#0F2557",
                shadowOpacity: 0.16,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 6 },
                elevation: 4,
              }}
            >
              <UserAvatar
                size={avatarSize}
                imageUrl={user.profilePhoto}
                initials={initialsFrom(user.fullname)}
                accessibilityLabel={`${user.fullname} profile photo`}
                fallbackBackgroundColor={palette.primary}
              />
            </View>

            {/* Standing, repeated as a dot on the portrait itself — the badge
                below carries the wording, this only makes it glanceable. */}
            {isActive ? (
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={{
                  position: "absolute",
                  right: 4,
                  bottom: 4,
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  borderWidth: 3,
                  borderColor: palette.avatarRing,
                  backgroundColor: palette.statusActive,
                }}
              />
            ) : null}
          </View>

          <View className={`min-w-0 ${compact ? "items-center" : "flex-1"}`}>
            <Text
              className={compact ? "text-[24px] font-bold" : "text-[30px] font-bold"}
              numberOfLines={2}
              style={{ color: palette.heading, lineHeight: compact ? 30 : 36 }}
            >
              {user.fullname}
            </Text>

            <View
              className={`mt-3 flex-row flex-wrap items-center gap-2 ${compact ? "justify-center" : ""}`}
            >
              <RoleBadge role={user.role} />
              <UserStatusBadge status={user.status} />
              <PlatformAccessBadge user={user} />
            </View>

            <Text
              className={`mt-3 text-[13px] italic ${compact ? "text-center" : ""}`}
              style={{ color: palette.muted }}
            >
              {HERO_TAGLINE}
            </Text>
          </View>
        </View>

        {/* Branding — present, never louder than the person it sits beside. */}
        <View className={`flex-row items-center gap-2.5 ${compact ? "" : "pl-6"}`}>
          <MaslogCareLogo size={44} color={palette.isDark ? "#7DB8FF" : "#8FC4F5"} />
          <View>
            <Text className="text-[19px] font-bold" style={{ color: palette.primary }}>
              MaslogCare
            </Text>
            <Text className="mt-0.5 text-[10.5px] font-medium" style={{ color: palette.subtle }}>
              People • Health • Community
            </Text>
          </View>
        </View>
      </View>

    </LinearGradient>
  );
}
