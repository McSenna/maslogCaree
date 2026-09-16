import { useEffect, useState } from "react";
import { useProfilePhoto } from "@/features/auth/hooks/useProfilePhoto";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { getCachedAccessToken } from "@/utils/storage";
import type { AuthContextValue } from "@/contexts/AuthContext";
import { updateMyProfile } from "../services/profileService";

type Options = {
  applyAuthUser: AuthContextValue["applyAuthUser"];
  showToast: (message: string, tone?: "success" | "error") => void;
};

export const useProfileAvatarUpload = ({ applyAuthUser, showToast }: Options) => {
  const { photo, setPhoto, choosePhoto } = useProfilePhoto();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!photo) return;

    let cancelled = false;

    (async () => {
      setSaving(true);
      try {
        const updated = await updateMyProfile({ profilePhoto: photo });
        if (cancelled) return;
        const token = getCachedAccessToken();
        if (token) applyAuthUser(updated, token);
        showToast("Profile photo updated.");
      } catch (error: unknown) {
        if (!cancelled) {
          showToast(
            getApiErrorMessage(error, "Unable to update your photo right now. Please try again."),
            "error"
          );
        }
      } finally {
        if (!cancelled) {
          setPhoto(null);
          setSaving(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [photo, setPhoto, applyAuthUser, showToast]);

  return { changeAvatar: choosePhoto, savingAvatar: saving };
};
