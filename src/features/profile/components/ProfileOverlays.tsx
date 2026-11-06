import AboutMaslogCareDialog from "@/components/about/AboutMaslogCareDialog";
import { toast } from "@/components/feedback/toast/toastStore";
import { HelpSupportOverlays } from "@/features/help-center";
import { ChangePasswordDialog } from "../change-password/ChangePasswordDialog";
import { CHANGE_PASSWORD_STRINGS } from "../change-password/changePasswordStrings";
import type { ProfileState } from "../hooks/useProfile";
import ProfileEditConfirmations from "./ProfileEditConfirmations";
import ProfileNoticeModal from "./ProfileNoticeModal";

/** Everything a profile row can open, shared by the web modal and the full-screen page. */
const ProfileOverlays = ({ state }: { state: ProfileState }) => (
  <>
    <ProfileNoticeModal notice={state.notice} onClose={state.dismissNotice} />
    <AboutMaslogCareDialog visible={state.aboutVisible} onClose={state.closeAbout} />
    <HelpSupportOverlays overlay={state.supportOverlay} />
    <ProfileEditConfirmations edit={state.edit} />
    <ChangePasswordDialog
      visible={state.changePasswordVisible}
      onClose={state.closeChangePassword}
      onSuccess={() => toast.success(CHANGE_PASSWORD_STRINGS.success.title, CHANGE_PASSWORD_STRINGS.success.description)}
    />
  </>
);

export default ProfileOverlays;
