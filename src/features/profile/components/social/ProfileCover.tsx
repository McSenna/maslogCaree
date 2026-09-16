import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { COVER_GRADIENT } from "../../config/profileSocialTheme";
import { PROFILE_RADIUS } from "../../config/profileTheme";
import ProfileHeroDecor from "../ProfileHeroDecor";

type ProfileCoverProps = {
  height: number;
};

const ProfileCover = ({ height }: ProfileCoverProps) => {
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
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
        borderTopLeftRadius: PROFILE_RADIUS.card,
        borderTopRightRadius: PROFILE_RADIUS.card,
      }}
    >
      <LinearGradient
        colors={[...COVER_GRADIENT]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {width > 0 ? (
        <View style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}>
          <ProfileHeroDecor width={Math.round(width * 0.62)} height={height} />
        </View>
      ) : null}
    </View>
  );
};

export default ProfileCover;
