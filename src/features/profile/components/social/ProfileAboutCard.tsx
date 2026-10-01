import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { TYPE } from "@/theme/typography";
import type { ProfileData } from "../../utils/profileData";
import ProfileInfoRow from "../ProfileInfoRow";
import ProfileSectionCard from "../ProfileSectionCard";

type ProfileAboutCardProps = {
  profile: ProfileData;
};

/** The Facebook "Intro" box: who this account is, apart from the editable details. */
const ProfileAboutCard = ({ profile }: ProfileAboutCardProps) => {
  const colors = useThemeColors();
  const status = profile.verified
    ? {
        icon: "check-circle" as const,
        value: "Verified",
        color: colors.success.fg,
      }
    : {
        icon: "clock" as const,
        value: "Waiting for verification",
        color: colors.warning.fg,
      };

  return (
    <ProfileSectionCard title="About">
      <Text
        maxFontSizeMultiplier={1.3}
        style={{ ...TYPE.body, color: colors.body }}
      >
        {profile.role.tagline}
      </Text>

      <View>
        <ProfileInfoRow
          icon="credit-card"
          label={profile.role.idLabel}
          value={profile.displayId}
        />
        {profile.joinedOn ? (
          <ProfileInfoRow
            icon="calendar"
            label="Joined MaslogCare"
            value={profile.joinedOn}
          />
        ) : null}
        <ProfileInfoRow
          icon={status.icon}
          iconColor={status.color}
          label="Account status"
          value={status.value}
        />
      </View>
    </ProfileSectionCard>
  );
};

export default ProfileAboutCard;
