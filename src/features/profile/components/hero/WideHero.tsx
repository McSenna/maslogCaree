import type { ReactNode } from "react";
import { Text, View, type LayoutChangeEvent } from "react-native";

import { PROFILE_COLORS, PROFILE_TYPE } from "../../config/profileTheme";
import type { ProfileData } from "../../utils/profileData";
import EditProfileButton from "../EditProfileButton";
import ProfileHeroDecor from "../ProfileHeroDecor";
import RoleBadge from "../RoleBadge";
import ContactItem from "./ContactItem";

type Props = {
  profile: ProfileData;
  photo: ReactNode;
  size: { width: number; height: number };
  onLayout: (e: LayoutChangeEvent) => void;
  surface: object;
  onEditProfile?: () => void;
};

const WideHero = ({ profile, photo, size, onLayout, surface, onEditProfile }: Props) => {
  return (
    <View onLayout={onLayout} style={surface}>
      {size.width > 0 ? <ProfileHeroDecor width={size.width} height={size.height} /> : null}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 22,
          padding: 22,
        }}
      >
        {photo}

        <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
            <View style={{ flex: 1, minWidth: 0, gap: 7 }}>
              <Text
                numberOfLines={2}
                maxFontSizeMultiplier={1.2}
                accessibilityRole="header"
                style={{
                  fontSize: PROFILE_TYPE.name,
                  fontWeight: "800",
                  letterSpacing: -0.5,
                  color: PROFILE_COLORS.navy,
                }}
              >
                {profile.name}
              </Text>

              <RoleBadge label={profile.role.label} style={profile.role.badge} />

              <Text
                numberOfLines={1}
                maxFontSizeMultiplier={1.2}
                style={{
                  fontSize: PROFILE_TYPE.label,
                  fontWeight: "500",
                  color: PROFILE_COLORS.muted,
                }}
              >
                {`${profile.role.idLabel}: ${profile.displayId}`}
              </Text>
            </View>

            <EditProfileButton onPress={onEditProfile} />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 18,
              marginTop: 4,
            }}
          >
            {profile.address ? <ContactItem icon="map-pin" value={profile.address} /> : null}
            {profile.phone ? <ContactItem icon="phone" value={profile.phone} /> : null}
            {profile.email ? <ContactItem icon="mail" value={profile.email} /> : null}
          </View>
        </View>
      </View>
    </View>
  );
};

export default WideHero;
