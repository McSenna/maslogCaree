import { View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import type { ProfileState } from "../hooks/useProfile";
import type { ProfileData } from "../utils/profileData";
import ProfileAccordionCard from "./ProfileAccordionCard";
import ProfileIdentityBlock from "./ProfileIdentityBlock";
import ProfileSectionBody from "./ProfileSectionBody";
import ProfileSectionEditAction from "./sectionForm/ProfileSectionEditAction";

type ProfileAccordionListProps = {
  profile: ProfileData;
  state: ProfileState;
};

const ProfileAccordionList = ({ profile, state }: ProfileAccordionListProps) => {
  const colors = useThemeColors();

  return (
    <View style={{ gap: SPACING.md }}>
      <View style={{ paddingVertical: SPACING.xs }}>
        <ProfileIdentityBlock
          profile={profile}
          layout="phone"
          onChangePhoto={state.onChangePhoto}
          changingPhoto={state.edit.savingAvatar}
        />
      </View>

      {profile.sections.map((section) =>
        section.presentation === "row" ? (
          <View
            key={section.id}
            style={{
              paddingHorizontal: SPACING.lg,
              borderRadius: RADII.medium,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <ProfileSectionBody section={section} email={profile.email} state={state} prominent />
          </View>
        ) : (
          <ProfileAccordionCard key={section.id} section={section}>
            <ProfileSectionBody section={section} email={profile.email} state={state} />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <ProfileSectionEditAction section={section} edit={state.edit} />
            </View>
          </ProfileAccordionCard>
        )
      )}
    </View>
  );
};

export default ProfileAccordionList;
