import { View } from "react-native";
import {
  AVATAR_SIZE,
  COVER_HEIGHT,
  SOCIAL_COLORS,
} from "../../config/profileSocialTheme";
import { PROFILE_RADIUS, PROFILE_SHADOW } from "../../config/profileTheme";
import type { ProfileData } from "../../utils/profileData";
import ProfilePhoto from "../ProfilePhoto";
import ProfileCover from "./ProfileCover";
import ProfileHeaderActions from "./ProfileHeaderActions";
import ProfileIdentity from "./ProfileIdentity";

type ProfileHeaderCardProps = {
  profile: ProfileData;
  wide: boolean;
  onEditProfile?: () => void;
  onChangePhoto?: () => void;
  onOpenSettings?: () => void;
  changingPhoto?: boolean;
};

const ProfileHeaderCard = ({
  profile,
  wide,
  onEditProfile,
  onChangePhoto,
  onOpenSettings,
  changingPhoto = false,
}: ProfileHeaderCardProps) => {
  const avatarSize = wide ? AVATAR_SIZE.wide : AVATAR_SIZE.compact;
  const centered = !wide;

  const actions = (
    <ProfileHeaderActions
      onEditProfile={onEditProfile}
      onOpenSettings={onOpenSettings}
      stacked={centered}
    />
  );

  return (
    <View
      style={{
        borderRadius: PROFILE_RADIUS.card,
        backgroundColor: SOCIAL_COLORS.surface,
        borderWidth: 1,
        borderColor: SOCIAL_COLORS.border,
        ...PROFILE_SHADOW.card,
      }}
    >
      <ProfileCover height={wide ? COVER_HEIGHT.wide : COVER_HEIGHT.compact} />

      <View style={{ paddingHorizontal: wide ? 24 : 16, paddingBottom: 18, gap: 16 }}>
        <View
          style={{
            flexDirection: centered ? "column" : "row",
            alignItems: centered ? "center" : "flex-end",
            gap: centered ? 12 : 20,
          }}
        >
          <View style={{ marginTop: -Math.round(avatarSize * 0.55) }}>
            <ProfilePhoto
              size={avatarSize}
              imageUrl={profile.avatarUrl}
              initials={profile.initials}
              name={profile.name}
              onChangePhoto={onChangePhoto}
              changingPhoto={changingPhoto}
            />
          </View>

          <ProfileIdentity profile={profile} centered={centered} />

          {centered ? null : actions}
        </View>

        {centered ? actions : null}
      </View>
    </View>
  );
};

export default ProfileHeaderCard;
