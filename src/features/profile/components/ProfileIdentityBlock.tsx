import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import RoleBadge from "@/features/users/components/RoleBadge";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import type { ProfileData } from "../utils/profileData";
import ProfilePhoto from "./ProfilePhoto";

const AVATAR_SIZE = { wide: 96, phone: 80 } as const;
const NOTICE_ICON = 18;

type ProfileIdentityBlockProps = {
  profile: ProfileData;
  layout: "wide" | "phone";
  onChangePhoto?: () => void;
  changingPhoto?: boolean;
};

const ProfileIdentityBlock = ({ profile, layout, onChangePhoto, changingPhoto }: ProfileIdentityBlockProps) => {
  const colors = useThemeColors();
  const isWide = layout === "wide";

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: isWide ? SPACING.xl : SPACING.lg }}>
      <ProfilePhoto
        size={AVATAR_SIZE[layout]}
        radius={isWide ? RADII.large : RADII.medium}
        imageUrl={profile.avatarUrl}
        initials={profile.initials}
        name={profile.name}
        onChangePhoto={onChangePhoto}
        changingPhoto={changingPhoto}
      />

      <View style={{ flex: 1, minWidth: 0, alignItems: "flex-start", gap: SPACING.xs }}>
        <Text style={{ ...(isWide ? TYPE.headline : TYPE.title), letterSpacing: -0.2, color: colors.heading }}>
          {profile.name}
        </Text>
        <RoleBadge role={profile.roleId} size="sm" />
        <Text style={{ ...TYPE.caption, fontWeight: "400", fontVariant: ["tabular-nums"], color: colors.muted }}>
          {profile.role.idLabel}: {profile.displayId}
        </Text>
        {profile.verified ? null : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm }}>
            <Feather name="clock" size={NOTICE_ICON} color={colors.warning.fg} />
            <Text style={{ ...TYPE.body, flexShrink: 1, color: colors.warning.fg }}>Waiting for verification</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfileIdentityBlock;
