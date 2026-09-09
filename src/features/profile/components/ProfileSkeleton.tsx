import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import {
  PROFILE_COLORS,
  PROFILE_RADIUS,
  PROFILE_SHADOW,
} from "../config/profileTheme";

type ProfileSkeletonProps = {
  /** Mirrors the real layout: the web modal is two columns, mobile is one. */
  twoColumn?: boolean;
};

function useShimmer() {
  const value = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0.5,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [value]);

  return value;
}

function Block({
  width,
  height,
  radius = 8,
  opacity,
}: {
  width: number | `${number}%`;
  height: number;
  radius?: number;
  opacity: Animated.Value;
}) {
  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: "#E7EDF5",
        opacity,
      }}
    />
  );
}

function CardSkeleton({
  rows,
  opacity,
}: {
  rows: number;
  opacity: Animated.Value;
}) {
  return (
    <View
      style={{
        gap: 14,
        padding: 16,
        borderRadius: PROFILE_RADIUS.card,
        backgroundColor: PROFILE_COLORS.surface,
        borderWidth: 1,
        borderColor: PROFILE_COLORS.border,
        ...PROFILE_SHADOW.card,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Block width={38} height={38} radius={12} opacity={opacity} />
        <Block width="55%" height={16} opacity={opacity} />
      </View>

      {Array.from({ length: rows }).map((_, index) => (
        <View
          key={index}
          style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
        >
          <Block width={20} height={20} radius={6} opacity={opacity} />
          <Block width="35%" height={12} opacity={opacity} />
          <View style={{ flex: 1 }} />
          <Block width="28%" height={12} opacity={opacity} />
        </View>
      ))}
    </View>
  );
}

/** Placeholder shown while the session is still restoring (§44). */
const ProfileSkeleton = ({ twoColumn = false }: ProfileSkeletonProps) => {
  const opacity = useShimmer();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading profile"
      style={{ gap: 16 }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 18,
          padding: 20,
          borderRadius: PROFILE_RADIUS.hero,
          backgroundColor: "#F1F7FE",
          borderWidth: 1,
          borderColor: "#DCEAFB",
        }}
      >
        <Block width={112} height={112} radius={56} opacity={opacity} />
        <View style={{ flex: 1, gap: 10 }}>
          <Block width="45%" height={12} opacity={opacity} />
          <Block width="72%" height={22} opacity={opacity} />
          <Block width={96} height={22} radius={999} opacity={opacity} />
          <Block width="55%" height={12} opacity={opacity} />
        </View>
      </View>

      <View
        style={{
          flexDirection: twoColumn ? "row" : "column",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: twoColumn ? 1.15 : undefined, width: twoColumn ? undefined : "100%" }}>
          <CardSkeleton rows={6} opacity={opacity} />
        </View>
        <View
          style={{
            flex: twoColumn ? 1 : undefined,
            width: twoColumn ? undefined : "100%",
            gap: 16,
          }}
        >
          <CardSkeleton rows={3} opacity={opacity} />
          <CardSkeleton rows={3} opacity={opacity} />
        </View>
      </View>
    </View>
  );
};

export default ProfileSkeleton;
