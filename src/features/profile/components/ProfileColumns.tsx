import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import type { ProfileState } from "../hooks/useProfile";
import type { ProfileData } from "../utils/profileData";
import type { ProfileSection } from "../utils/buildProfileSections";
import ProfileIdentityBlock from "./ProfileIdentityBlock";
import ProfileSectionBody from "./ProfileSectionBody";
import ProfileSectionEditAction from "./sectionForm/ProfileSectionEditAction";

type ProfileColumnsProps = {
  profile: ProfileData;
  state: ProfileState;
  twoColumn: boolean;
};

// Details need room for two fields side by side. The links on the right are one short line each.
const DETAILS_COLUMN_FLEX = 1.5;
// Matches the Edit link, so headings in both columns start on the same line.
const HEADING_MIN_HEIGHT = 44;

const SectionBlock = ({ section, profile, state }: { section: ProfileSection; profile: ProfileData; state: ProfileState }) => {
  const colors = useThemeColors();

  if (section.presentation === "row") {
    return <ProfileSectionBody section={section} email={profile.email} state={state} prominent />;
  }

  return (
    <View style={{ gap: section.kind === "fields" ? SPACING.md : SPACING.xs }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.md, minHeight: HEADING_MIN_HEIGHT }}>
        <Text
          accessibilityRole="header"
          aria-level={2}
          style={{ ...TYPE.title, flex: 1, minWidth: 0, color: colors.heading }}
        >
          {section.title}
        </Text>
        <ProfileSectionEditAction section={section} edit={state.edit} />
      </View>
      <ProfileSectionBody section={section} email={profile.email} state={state} />
    </View>
  );
};

const ProfileColumns = ({ profile, state, twoColumn }: ProfileColumnsProps) => {
  const colors = useThemeColors();

  const renderColumn = (column: ProfileSection["column"]) =>
    profile.sections
      .filter((section) => section.column === column)
      .map((section) => <SectionBlock key={section.id} section={section} profile={profile} state={state} />);

  return (
    <View style={{ gap: SPACING.xl }}>
      <ProfileIdentityBlock
        profile={profile}
        layout="wide"
        onChangePhoto={state.onChangePhoto}
        changingPhoto={state.edit.savingAvatar}
      />
      <View style={{ height: 1, backgroundColor: colors.divider }} />
      <View style={{ flexDirection: twoColumn ? "row" : "column", gap: SPACING.xl }}>
        <View style={{ flex: twoColumn ? DETAILS_COLUMN_FLEX : undefined, minWidth: 0, gap: SPACING.xl }}>
          {renderColumn("left")}
        </View>
        <View
          style={{
            width: twoColumn ? 1 : "100%",
            height: twoColumn ? "auto" : 1,
            backgroundColor: colors.divider,
          }}
        />
        <View style={{ flex: twoColumn ? 1 : undefined, minWidth: 0, gap: SPACING.xl }}>
          {renderColumn("right")}
        </View>
      </View>
    </View>
  );
};

export default ProfileColumns;
