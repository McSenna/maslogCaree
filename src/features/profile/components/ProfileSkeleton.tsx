import { View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import Block from "./skeleton/Block";
import SectionSkeleton from "./skeleton/SectionSkeleton";
import { useShimmer } from "./skeleton/useShimmer";

type ProfileSkeletonProps = {
  twoColumn?: boolean;
  avatarSize?: number;
};

const DETAILS_COLUMN_FLEX = 1.5;

const ProfileSkeleton = ({ twoColumn = false, avatarSize = 96 }: ProfileSkeletonProps) => {
  const opacity = useShimmer();
  const colors = useThemeColors();

  return (
    <View accessibilityRole="progressbar" accessibilityLabel="Loading profile" style={{ gap: SPACING.xl }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.lg }}>
        <Block width={avatarSize} height={avatarSize} radius={RADII.large} opacity={opacity} />
        <View style={{ flex: 1, gap: SPACING.sm }}>
          <Block width="50%" height={22} opacity={opacity} />
          <Block width="25%" height={14} opacity={opacity} />
          <Block width="35%" height={14} opacity={opacity} />
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: colors.divider }} />
      <View style={{ flexDirection: twoColumn ? "row" : "column", gap: SPACING.xl }}>
        <View style={{ flex: twoColumn ? DETAILS_COLUMN_FLEX : undefined, gap: SPACING.xl }}>
          <SectionSkeleton rows={4} opacity={opacity} shape="fields" />
          <SectionSkeleton rows={2} opacity={opacity} shape="fields" />
        </View>
        <View style={{ flex: twoColumn ? 1 : undefined, gap: SPACING.xl }}>
          <SectionSkeleton rows={2} opacity={opacity} />
          <SectionSkeleton rows={3} opacity={opacity} />
        </View>
      </View>
    </View>
  );
};

export default ProfileSkeleton;
