import { useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { COVER_COLOR } from "../../config/profileSocialTheme";
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
        backgroundColor: COVER_COLOR,
      }}
    >

      {width > 0 ? (
        <View style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}>
          <ProfileHeroDecor width={Math.round(width * 0.62)} height={height} />
        </View>
      ) : null}
    </View>
  );
};

export default ProfileCover;
