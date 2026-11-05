import { View } from "react-native";
import { SPACING } from "@/theme/spacing";
import { isProfileEditSection } from "../config/profileEditSections";
import { getProfileActionHandlers } from "../hooks/useProfileActionHandlers";
import type { ProfileState } from "../hooks/useProfile";
import type { ProfileSection } from "../utils/buildProfileSections";
import FormActions from "./profileForm/FormActions";
import ProfileInfoRow from "./ProfileInfoRow";
import ContactInfoForm from "./sectionForm/ContactInfoForm";
import PersonalInfoForm from "./sectionForm/PersonalInfoForm";
import SettingsRow from "./SettingsRow";

type ProfileSectionBodyProps = {
  section: ProfileSection;
  email: string;
  state: ProfileState;
  prominent?: boolean;
};

const ProfileSectionBody = ({ section, email, state, prominent = false }: ProfileSectionBodyProps) => {
  const { edit } = state;
  const isEditing = isProfileEditSection(section.id) && edit.editingSection === section.id;

  if (isEditing) {
    return (
      <View style={{ gap: SPACING.lg, paddingVertical: SPACING.xs }}>
        {section.id === "personal" ? (
          <PersonalInfoForm form={edit.editForm} />
        ) : (
          <ContactInfoForm form={edit.editForm} email={email} />
        )}
        <FormActions
          isSubmitting={edit.editSaving}
          canSave={edit.editForm.isDirty}
          onDiscard={edit.requestCancelEdit}
          onSave={edit.requestSaveEdit}
        />
      </View>
    );
  }

  if (section.kind === "fields") {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: SPACING.lg, rowGap: SPACING.lg }}>
        {section.rows.map((row) =>
          row.kind === "field" ? (
            <ProfileInfoRow
              key={row.key}
              label={row.label}
              value={row.value}
              icon={row.icon}
              provided={row.provided}
              fullWidth={row.fullWidth}
            />
          ) : null
        )}
      </View>
    );
  }

  const handlers = getProfileActionHandlers(state);

  return (
    <View>
      {section.rows.map((row, index) => {
        if (row.kind === "field") return null;
        const showDivider = index < section.rows.length - 1;

        return (
          <SettingsRow
            key={row.key}
            label={row.label}
            icon={row.icon}
            hint={row.hint}
            prominent={prominent}
            showDivider={showDivider}
            {...handlers[row.key]}
          />
        );
      })}
    </View>
  );
};

export default ProfileSectionBody;
