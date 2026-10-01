import { View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { AVATAR_OVERLAP, AVATAR_SIZE, COVER_HEIGHT } from "../config/profileSocialTheme";
import Block from "./skeleton/Block";
import CardSkeleton from "./skeleton/CardSkeleton";
import { useShimmer } from "./skeleton/useShimmer";

type ProfileScreenSkeletonProps = {
  wide: boolean;
  twoColumn: boolean;
};

const ProfileScreenSkeleton = ({ wide, twoColumn }: ProfileScreenSkeletonProps) => {
  const colors = useThemeColors();
  const opacity = useShimmer();
  const avatarSize = wide ? AVATAR_SIZE.wide : AVATAR_SIZE.compact;
  const gutter = wide ? SPACING.xl : SPACING.lg;

  return (
    <View accessibilityRole="progressbar" accessibilityLabel="Loading profile" style={{ gap: SPACING.lg }}>
      <View
        style={{
          borderRadius: RADII.large,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
      >
        <View style={{ height: wide ? COVER_HEIGHT.wide : COVER_HEIGHT.compact, backgroundColor: colors.surfaceMuted }} />

        <View
          style={{
            flexDirection: wide ? "row" : "column",
            alignItems: wide ? "flex-end" : "flex-start",
            gap: wide ? SPACING.xl : SPACING.md,
            paddingHorizontal: gutter,
            paddingBottom: SPACING.xl,
          }}
        >
          <View
            style={{
              marginTop: -Math.round(avatarSize * AVATAR_OVERLAP),
              borderRadius: avatarSize / 2,
              borderWidth: 4,
              borderColor: colors.surface,
            }}
          >
            <Block width={avatarSize - 8} height={avatarSize - 8} radius={avatarSize / 2} opacity={opacity} />
          </View>

          <View style={{ flex: wide ? 1 : undefined, width: wide ? undefined : "100%", gap: SPACING.sm, paddingBottom: wide ? SPACING.sm : 0 }}>
            <Block width="52%" height={wide ? 28 : 22} opacity={opacity} />
            <Block width="38%" height={14} opacity={opacity} />
          </View>
        </View>

        <View style={{ height: 1, marginHorizontal: gutter, backgroundColor: colors.divider }} />
        <View style={{ flexDirection: "row", gap: SPACING.xl, paddingHorizontal: gutter, paddingVertical: SPACING.lg }}>
          {[0, 1, 2].map((key) => (
            <Block key={key} width={72} height={14} opacity={opacity} />
          ))}
        </View>
      </View>

      <View style={{ flexDirection: twoColumn ? "row" : "column", gap: SPACING.lg, alignItems: "flex-start" }}>
        <View style={{ flexBasis: twoColumn ? "38%" : undefined, width: twoColumn ? undefined : "100%" }}>
          <CardSkeleton rows={3} opacity={opacity} />
        </View>
        <View style={{ flex: twoColumn ? 1 : undefined, width: twoColumn ? undefined : "100%" }}>
          <CardSkeleton rows={4} opacity={opacity} />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreenSkeleton;
