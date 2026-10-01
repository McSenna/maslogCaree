import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import type { ProfileStat } from "../../types/profile.types";
import type { ProfileData } from "../../utils/profileData";
import ProfileStatLine from "./ProfileStatLine";

type ProfileIdentityProps = {
  profile: ProfileData;
  wide: boolean;
  stats: ProfileStat[];
  statsLoading: boolean;
  statsUnavailable: boolean;
};

const ProfileIdentity = ({
  profile,
  wide,
  stats,
  statsLoading,
  statsUnavailable,
}: ProfileIdentityProps) => {
  const colors = useThemeColors();
  const nameType = wide ? TYPE.display : TYPE.headline;
  const verification = profile.verified
    ? `verified ${profile.role.label.toLowerCase()}`
    : "verification pending";

  return (
    <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 260, minWidth: 0, gap: SPACING.xs }}>
      <Text
        accessibilityRole="header"
        accessibilityLabel={`${profile.name}, ${verification}`}
        numberOfLines={3}
        maxFontSizeMultiplier={1.3}
        style={{ ...nameType, letterSpacing: -0.4, color: colors.heading }}
      >
        {profile.name}
        {profile.verified ? (
          <Text>
            {" "}
            <Feather name="check-circle" size={wide ? 20 : 17} color={colors.primary} />
          </Text>
        ) : null}
      </Text>

      <ProfileStatLine
        roleLabel={profile.role.label}
        stats={stats}
        loading={statsLoading}
        unavailable={statsUnavailable}
      />
    </View>
  );
};

export default ProfileIdentity;
