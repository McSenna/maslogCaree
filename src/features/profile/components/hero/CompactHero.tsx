import type { ReactNode } from "react";
import { Text, View, type LayoutChangeEvent } from "react-native";

import { PROFILE_COLORS, PROFILE_TYPE } from "../../config/profileTheme";
import type { ProfileData } from "../../utils/profileData";
import ProfileHeroDecor from "../ProfileHeroDecor";
import RoleBadge from "../RoleBadge";

type Props = {
  profile: ProfileData;
  photo: ReactNode;
  size: { width: number; height: number };
  onLayout: (e: LayoutChangeEvent) => void;
  surface: object;
};

const CompactHero = ({ profile, photo, size, onLayout, surface }: Props) => {
  return (
    <View onLayout={onLayout} style={surface}>
      {size.width > 0 ? (
        <ProfileHeroDecor width={size.width * 0.5} height={size.height} />
      ) : null}

      <View style={{ padding: 18, gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          {photo}

          <View style={{ flex: 1, minWidth: 0, gap: 7 }}>
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.2}
              style={{
                fontSize: 11,
                fontWeight: "700",
                letterSpacing: 1,
                textTransform: "uppercase",
                color: PROFILE_COLORS.subtle,
              }}
            >
              {profile.role.title}
            </Text>

            <Text
              numberOfLines={2}
              maxFontSizeMultiplier={1.2}
              accessibilityRole="header"
              style={{
                fontSize: PROFILE_TYPE.nameCompact,
                lineHeight: 27,
                fontWeight: "800",
                letterSpacing: -0.4,
                color: PROFILE_COLORS.navy,
              }}
            >
              {profile.name}
            </Text>

            <RoleBadge label={profile.role.label} style={profile.role.badge} compact />

            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.2}
              style={{
                fontSize: 13.5,
                fontWeight: "500",
                color: PROFILE_COLORS.muted,
              }}
            >
              {profile.displayId}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={2}
          maxFontSizeMultiplier={1.2}
          style={{
            fontSize: PROFILE_TYPE.meta,
            lineHeight: 18,
            fontStyle: "italic",
            color: PROFILE_COLORS.muted,
          }}
        >
          “{profile.role.tagline}”
        </Text>
      </View>
    </View>
  );
};

export default CompactHero;
