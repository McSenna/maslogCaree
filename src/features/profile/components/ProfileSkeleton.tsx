import { View } from "react-native";
import CardSkeleton from "./skeleton/CardSkeleton";
import HeroSkeleton from "./skeleton/HeroSkeleton";
import { useShimmer } from "./skeleton/useShimmer";

type ProfileSkeletonProps = {
  twoColumn?: boolean;
};

const ProfileSkeleton = ({ twoColumn = false }: ProfileSkeletonProps) => {
  const opacity = useShimmer();

  return (
    <View accessibilityRole="progressbar" accessibilityLabel="Loading profile" style={{ gap: 16 }}>
      <HeroSkeleton opacity={opacity} />

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
