import { useCallback, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/feedback/toast/toastStore";
import { getCachedAccessToken } from "@/utils/storage";
import {
  PROFILE_EDIT_SECTION_COPY,
  type ProfileEditSection,
} from "../config/profileEditSections";
import { updateMyProfile } from "../services/profileService";
import { buildEditProfileValues } from "../utils/editProfileValues";
import { useEditProfileForm } from "./useEditProfileForm";
import { useProfileAvatarUpload } from "./useProfileAvatarUpload";
import { toastError } from "@/utils/errorToast/toastError";

const SAVE_ERROR = "Unable to update your profile right now. Please try again.";

export const useEditProfile = () => {
  const { user, applyAuthUser } = useAuth();

  const [section, setSection] = useState<ProfileEditSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmingSave, setConfirmingSave] = useState(false);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  const form = useEditProfileForm(section);
  const avatar = useProfileAvatarUpload({ applyAuthUser });
  const inFlight = useRef(false);

  const initialValues = useMemo(() => buildEditProfileValues(user), [user]);

  const stopEditing = useCallback(() => {
    setSection(null);
    setConfirmingSave(false);
    setConfirmingDiscard(false);
  }, []);

  const startEditing = useCallback(
    (next: ProfileEditSection) => {
      if (section === next) return;
      form.syncTo(initialValues);
      setSection(next);
    },
    [section, form, initialValues]
  );

  const requestCancel = useCallback(() => {
    if (form.isDirty) {
      setConfirmingDiscard(true);
      return;
    }
    stopEditing();
  }, [form.isDirty, stopEditing]);

  const requestSave = useCallback(() => {
    if (saving || !form.isDirty || !form.validate()) return;
    setConfirmingSave(true);
  }, [saving, form]);

  const confirmSave = useCallback(async () => {
    if (inFlight.current || !section) return;

    const payload = form.buildPayload();
    setConfirmingSave(false);

    if (Object.keys(payload).length === 0) {
      stopEditing();
      return;
    }

    inFlight.current = true;
    setSaving(true);

    try {
      const updated = await updateMyProfile(payload);
      const token = getCachedAccessToken();
      if (token) applyAuthUser(updated, token);

      toast.success(PROFILE_EDIT_SECTION_COPY[section].success);
      stopEditing();
    } catch (error: unknown) {
      toastError("Changes not saved", error, { fallback: SAVE_ERROR });
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  }, [section, form, applyAuthUser, stopEditing]);

  return {
    editingSection: section,
    editForm: form,
    editSaving: saving,
    editConfirmingSave: confirmingSave,
    editConfirmingDiscard: confirmingDiscard,
    editSectionNoun: section ? PROFILE_EDIT_SECTION_COPY[section].noun : "profile details",
    startEditing,
    requestCancelEdit: requestCancel,
    confirmDiscardEdit: stopEditing,
    cancelDiscardEdit: useCallback(() => setConfirmingDiscard(false), []),
    requestSaveEdit: requestSave,
    confirmSaveEdit: confirmSave,
    cancelSaveEdit: useCallback(() => setConfirmingSave(false), []),
    changeAvatar: avatar.changeAvatar,
    savingAvatar: avatar.savingAvatar,
  };
};

export type ProfileEditState = ReturnType<typeof useEditProfile>;
