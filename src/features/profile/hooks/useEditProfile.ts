import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { getCachedAccessToken } from "@/utils/storage";
import { updateMyProfile } from "../services/profileService";
import { useEditProfileForm, type EditProfileInitial } from "./useEditProfileForm";
import { useProfileAvatarUpload } from "./useProfileAvatarUpload";

export const useEditProfile = () => {
  const { user, applyAuthUser } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const form = useEditProfileForm();
  const avatar = useProfileAvatarUpload({ applyAuthUser, showToast });

  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  const initial = useMemo<EditProfileInitial>(
    () => ({
      fullname: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
    }),
    [user]
  );

  const open = useCallback(() => {
    form.syncTo(initial);
    setVisible(true);
  }, [form, initial]);

  const requestClose = useCallback(() => {
    if (form.isDirty) {
      setConfirmingDiscard(true);
      return;
    }
    setVisible(false);
  }, [form.isDirty]);

  const confirmDiscard = useCallback(() => {
    setConfirmingDiscard(false);
    setVisible(false);
  }, []);

  const cancelDiscard = useCallback(() => setConfirmingDiscard(false), []);

  const save = useCallback(async () => {
    if (!form.validate()) return;

    const payload = form.buildPayload();
    if (Object.keys(payload).length === 0) {
      setVisible(false);
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMyProfile(payload);
      const token = getCachedAccessToken();
      if (token) applyAuthUser(updated, token);
      showToast("Profile updated successfully.");
      setVisible(false);
    } catch (error: unknown) {
      showToast(
        getApiErrorMessage(error, "Unable to update your profile right now. Please try again."),
        "error"
      );
    } finally {
      setSaving(false);
    }
  }, [form, applyAuthUser, showToast]);

  return {
    editVisible: visible,
    editForm: form,
    editSaving: saving,
    editConfirmingDiscard: confirmingDiscard,
    openEditProfile: open,
    requestCloseEditProfile: requestClose,
    confirmDiscardEditProfile: confirmDiscard,
    cancelDiscardEditProfile: cancelDiscard,
    saveEditProfile: save,
    changeAvatar: avatar.changeAvatar,
    savingAvatar: avatar.savingAvatar,
    toast,
    hideToast,
  };
};
