import { Text, View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { PROFILE_TYPE } from "../../config/profileTheme";
import type { ProfileData } from "../../utils/profileData";
import VerifiedPill from "./VerifiedPill";

type ProfileIdentityProps = {
  profile: ProfileData;
  centered: boolean;
};

const ProfileIdentity = ({ profile, centered }: ProfileIdentityProps) => (
  <View
    style={{
      flex: centered ? undefined : 1,
      width: centered ? "100%" : undefined,
      minWidth: 0,
      gap: 7,
      alignItems: centered ? "center" : "flex-start",
    }}
  >
    <Text
      numberOfLines={2}
      maxFontSizeMultiplier={1.2}
      accessibilityRole="header"
      style={{
        fontSize: centered ? PROFILE_TYPE.nameCompact : PROFILE_TYPE.name,
        lineHeight: centered ? 28 : 31,
        fontWeight: "800",
        letterSpacing: -0.5,
        textAlign: centered ? "center" : "left",
        color: SOCIAL_COLORS.navy,
      }}
    >
      {profile.name}
    </Text>

    <Text
      numberOfLines={1}
      maxFontSizeMultiplier={1.2}
      style={{
        fontSize: PROFILE_TYPE.value,
        fontWeight: "600",
        color: SOCIAL_COLORS.muted,
      }}
    >
      {`${profile.role.label} · ${profile.displayId}`}
    </Text>

    <VerifiedPill verified={profile.verified} roleLabel={profile.role.label} />

    <Text
      numberOfLines={2}
      maxFontSizeMultiplier={1.2}
      style={{
        fontSize: PROFILE_TYPE.meta,
        lineHeight: 18,
        textAlign: centered ? "center" : "left",
        color: SOCIAL_COLORS.subtle,
      }}
    >
      {profile.role.tagline}
    </Text>
  </View>
);

export default ProfileIdentity;
