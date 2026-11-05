import { isProfileEditSection } from "../../config/profileEditSections";
import type { ProfileEditState } from "../../hooks/useEditProfile";
import type { ProfileSection } from "../../utils/buildProfileSections";
import { SectionEditLink, SectionEditingBadge } from "./SectionEditControls";

type ProfileSectionEditActionProps = {
  section: ProfileSection;
  edit: ProfileEditState;
};

/** One section edits at a time, so the others hide their link until it finishes. */
const ProfileSectionEditAction = ({ section, edit }: ProfileSectionEditActionProps) => {
  if (!isProfileEditSection(section.id)) return null;

  const sectionId = section.id;
  if (edit.editingSection === sectionId) return <SectionEditingBadge />;
  if (edit.editingSection) return null;

  return (
    <SectionEditLink
      label={`Edit ${section.title.toLowerCase()}`}
      onPress={() => edit.startEditing(sectionId)}
    />
  );
};

export default ProfileSectionEditAction;
