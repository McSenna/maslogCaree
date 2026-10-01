import { View, type LayoutChangeEvent } from "react-native";
import { SPACING } from "@/theme/spacing";
import { isProfileEditSection } from "../config/profileEditSections";
import type { ProfileEditState } from "../hooks/useEditProfile";
import type { ProfileInfoGroup } from "../types/profile.types";
import FormActions from "./profileForm/FormActions";
import ContactInfoForm from "./sectionForm/ContactInfoForm";
import PersonalInfoForm from "./sectionForm/PersonalInfoForm";
import {
  SectionEditLink,
  SectionEditingBadge,
} from "./sectionForm/SectionEditControls";
import ProfileInfoRow from "./ProfileInfoRow";
import ProfileSectionCard from "./ProfileSectionCard";

type ProfileInfoCardProps = {
  group: ProfileInfoGroup;
  edit?: ProfileEditState;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const ProfileInfoCard = ({ group, edit, onLayout }: ProfileInfoCardProps) => {
  const section = isProfileEditSection(group.key) ? group.key : null;
  const editable = Boolean(edit && section);
  const isEditing = editable && edit?.editingSection === section;
  const otherSectionEditing = Boolean(edit?.editingSection) && !isEditing;

  const renderAction = () => {
    if (!editable || !section || !edit) return null;
    if (isEditing) return <SectionEditingBadge />;
    if (otherSectionEditing) return null;

    return (
      <SectionEditLink
        label={`Edit ${group.title.toLowerCase()}`}
        onPress={() => edit.startEditing(section)}
      />
    );
  };

  const renderBody = () => {
    if (isEditing && edit && section) {
      return (
        <View style={{ paddingTop: SPACING.xs, paddingBottom: SPACING.xs }}>
          {section === "personal" ? (
            <PersonalInfoForm form={edit.editForm} />
          ) : (
            <ContactInfoForm
              form={edit.editForm}
              email={group.items.find((item) => item.key === "email")?.value ?? ""}
            />
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

    return (
      <View>
        {group.items.map((item) => (
          <ProfileInfoRow
            key={item.key}
            label={item.label}
            value={item.value}
            icon={item.icon}
            provided={item.provided}
          />
        ))}
      </View>
    );
  };

  return (
    <View onLayout={onLayout}>
      <ProfileSectionCard
        title={group.title}
        action={renderAction()}
        highlighted={isEditing}
      >
        {renderBody()}
      </ProfileSectionCard>
    </View>
  );
};

export default ProfileInfoCard;
