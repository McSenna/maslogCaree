import { useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import CoverEngraving from "./CoverEngraving";

type ProfileCoverProps = {
  height: number;
};

const ProfileCover = ({ height }: ProfileCoverProps) => {
  const colors = useThemeColors();
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    setWidth((prev) => (prev === next ? prev : next));
  };

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={handleLayout}
      style={{
        height,
        overflow: "hidden",
        borderTopLeftRadius: RADII.large,
        borderTopRightRadius: RADII.large,
        backgroundColor: colors.primarySoft,
      }}
    >
      {width > 0 ? (
        <View style={StyleSheet.absoluteFill}>
          <CoverEngraving width={width} height={height} color={colors.primary} />
        </View>
      ) : null}
    </View>
  );
};

export default ProfileCover;
