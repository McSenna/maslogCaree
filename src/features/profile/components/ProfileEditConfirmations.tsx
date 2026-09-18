import ConfirmationModal from "@/components/ui/ConfirmationModal";
import type { ProfileEditState } from "../hooks/useEditProfile";

type ProfileEditConfirmationsProps = {
  edit: ProfileEditState;
};

const ProfileEditConfirmations = ({ edit }: ProfileEditConfirmationsProps) => (
  <>
    <ConfirmationModal
      visible={edit.editConfirmingSave}
      title="Save profile changes?"
      message={`Are you sure you want to update your ${edit.editSectionNoun}?`}
      confirmLabel="Save Changes"
      cancelLabel="Cancel"
      onConfirm={() => void edit.confirmSaveEdit()}
      onCancel={edit.cancelSaveEdit}
    />

    <ConfirmationModal
      visible={edit.editConfirmingDiscard}
      title="Discard changes?"
      message="Your unsaved profile changes will be lost."
      confirmLabel="Discard Changes"
      cancelLabel="Keep Editing"
      destructive
      onConfirm={edit.confirmDiscardEdit}
      onCancel={edit.cancelDiscardEdit}
    />
  </>
);

export default ProfileEditConfirmations;
