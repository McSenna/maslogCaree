import { View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { AVATAR_OVERLAP, AVATAR_SIZE, COVER_HEIGHT } from "../../config/profileSocialTheme";
import type { ProfileTabsState } from "../../hooks/useProfileTabs";
import type { ProfileStat } from "../../types/profile.types";
import type { ProfileData } from "../../utils/profileData";
import ProfilePhoto from "../ProfilePhoto";
import ProfileActions from "./ProfileActions";
import ProfileCover from "./ProfileCover";
import ProfileIdentity from "./ProfileIdentity";
import ProfileTabs from "./ProfileTabs";

type ProfileHeaderCardProps = {
  profile: ProfileData;
  wide: boolean;
  actionsInline: boolean;
  stats: ProfileStat[];
  statsLoading: boolean;
  statsUnavailable: boolean;
  tabs: ProfileTabsState;
  onEditProfile: () => void;
  onBookAppointment?: () => void;
  onChangePhoto?: () => void;
  changingPhoto?: boolean;
};

const ProfileHeaderCard = ({
  profile,
  wide,
  actionsInline,
  stats,
  statsLoading,
  statsUnavailable,
  tabs,
  onEditProfile,
  onBookAppointment,
  onChangePhoto,
  changingPhoto = false,
}: ProfileHeaderCardProps) => {
  const colors = useThemeColors();
  const avatarSize = wide ? AVATAR_SIZE.wide : AVATAR_SIZE.compact;
  const gutter = wide ? SPACING.xl : SPACING.lg;

  // Phones edit through each card's own "Edit" link, so the header stays short.
  const actions = (
    <ProfileActions
      stretch={!actionsInline}
      onEditProfile={wide ? onEditProfile : undefined}
      onBookAppointment={onBookAppointment}
    />
  );

  return (
    <View
      style={{
        borderRadius: RADII.large,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <ProfileCover height={wide ? COVER_HEIGHT.wide : COVER_HEIGHT.compact} />

      <View style={{ paddingHorizontal: gutter, paddingBottom: SPACING.lg, gap: SPACING.lg }}>
        <View
          style={{
            flexDirection: wide ? "row" : "column",
            alignItems: "flex-start",
            gap: wide ? SPACING.xl : SPACING.md,
          }}
        >
          <View style={{ marginTop: -Math.round(avatarSize * AVATAR_OVERLAP) }}>
            <ProfilePhoto
              size={avatarSize}
              imageUrl={profile.avatarUrl}
              initials={profile.initials}
              name={profile.name}
              onChangePhoto={onChangePhoto}
              changingPhoto={changingPhoto}
            />
          </View>

          <View
            style={{
              flex: wide ? 1 : undefined,
              alignSelf: "stretch",
              minWidth: 0,
              flexDirection: "row",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: SPACING.lg,
              paddingTop: wide ? SPACING.lg : 0,
              justifyContent: "flex-end",
            }}
          >
            <ProfileIdentity
              profile={profile}
              wide={wide}
              stats={stats}
              statsLoading={statsLoading}
              statsUnavailable={statsUnavailable}
            />
            {actionsInline ? actions : null}
          </View>
        </View>

        {actionsInline ? null : actions}
      </View>

      <View style={{ height: 1, marginHorizontal: gutter, backgroundColor: colors.divider }} />

      <ProfileTabs
        tabs={tabs.tabs}
        activeTab={tabs.activeTab}
        onSelect={tabs.selectTab}
        compact={!wide}
      />
    </View>
  );
};

export default ProfileHeaderCard;
