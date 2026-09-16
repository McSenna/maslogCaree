import { useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
import type { useEditProfile } from "../hooks/useEditProfile";
import type { ProfileData } from "../utils/profileData";
import EditProfileBottomSheet from "./editProfile/EditProfileBottomSheet";
import EditProfileModal from "./editProfile/EditProfileModal";

type EditProfileDialogProps = {
  profile: ProfileData | null;
  edit: ReturnType<typeof useEditProfile>;
};

const EditProfileDialog = ({ profile, edit }: EditProfileDialogProps) => {
  const { width } = useWindowDimensions();

  if (!profile) return null;

  return width >= BREAKPOINTS.tablet ? (
    <EditProfileModal visible={edit.editVisible} profile={profile} edit={edit} />
  ) : (
    <EditProfileBottomSheet visible={edit.editVisible} profile={profile} edit={edit} />
  );
};

export default EditProfileDialog;
