import { View } from "react-native";
import { AVATAR_SIZE, COVER_HEIGHT, SOCIAL_COLORS } from "../config/profileSocialTheme";
import { PROFILE_RADIUS } from "../config/profileTheme";
import Block from "./skeleton/Block";
import CardSkeleton from "./skeleton/CardSkeleton";
import { useShimmer } from "./skeleton/useShimmer";

type ProfileScreenSkeletonProps = {
  wide: boolean;
  twoColumn: boolean;
};

const surface = {
  borderRadius: PROFILE_RADIUS.card,
  backgroundColor: SOCIAL_COLORS.surface,
  borderWidth: 1,
  borderColor: SOCIAL_COLORS.border,
} as const;

const ProfileScreenSkeleton = ({ wide, twoColumn }: ProfileScreenSkeletonProps) => {
  const opacity = useShimmer();
  const avatarSize = wide ? AVATAR_SIZE.wide : AVATAR_SIZE.compact;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading profile"
      style={{ gap: 14 }}
    >
      <View style={surface}>
        <Block width="100%" height={wide ? COVER_HEIGHT.wide : COVER_HEIGHT.compact} radius={PROFILE_RADIUS.card} opacity={opacity} />

        <View
          style={{
            flexDirection: wide ? "row" : "column",
            alignItems: wide ? "flex-end" : "center",
            gap: 16,
            paddingHorizontal: wide ? 24 : 16,
            paddingBottom: 18,
          }}
        >
          <View style={{ marginTop: -Math.round(avatarSize * 0.55) }}>
            <Block width={avatarSize} height={avatarSize} radius={avatarSize / 2} opacity={opacity} />
          </View>

          <View style={{ flex: 1, width: "100%", gap: 9, alignItems: wide ? "flex-start" : "center" }}>
            <Block width="58%" height={22} opacity={opacity} />
            <Block width="40%" height={13} opacity={opacity} />
            <Block width={132} height={22} radius={999} opacity={opacity} />
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 24, padding: 16, ...surface }}>
        {[0, 1, 2, 3].map((key) => (
          <View key={key} style={{ flex: 1, alignItems: "center", gap: 7 }}>
            <Block width={34} height={20} opacity={opacity} />
            <Block width="70%" height={11} opacity={opacity} />
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row", gap: 16, padding: 16, ...surface }}>
        {[0, 1, 2, 3].map((key) => (
          <Block key={key} width="22%" height={14} opacity={opacity} />
        ))}
      </View>

      <View style={{ flexDirection: twoColumn ? "row" : "column", gap: 16, alignItems: "flex-start" }}>
        <View style={{ flex: twoColumn ? 1 : undefined, width: twoColumn ? undefined : "100%" }}>
          <CardSkeleton rows={4} opacity={opacity} />
        </View>
        <View style={{ flex: twoColumn ? 1 : undefined, width: twoColumn ? undefined : "100%" }}>
          <CardSkeleton rows={3} opacity={opacity} />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreenSkeleton;
