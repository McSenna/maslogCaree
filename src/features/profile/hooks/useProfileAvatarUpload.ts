import { useEffect, useState } from "react";
import { toast } from "@/components/feedback/toast/toastStore";
import { useProfilePhoto } from "@/features/auth/hooks/useProfilePhoto";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { getCachedAccessToken } from "@/utils/storage";
import type { AuthContextValue } from "@/contexts/AuthContext";
import { updateMyProfile } from "../services/profileService";

type Options = {
  applyAuthUser: AuthContextValue["applyAuthUser"];
};

export const useProfileAvatarUpload = ({ applyAuthUser }: Options) => {
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
        toast.success("Profile photo updated");
      } catch (error: unknown) {
        if (!cancelled) {
          toast.error(
            "Photo not updated",
            getApiErrorMessage(error, "Unable to update your photo right now. Please try again.")
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
  }, [photo, setPhoto, applyAuthUser]);

  return { changeAvatar: choosePhoto, savingAvatar: saving };
};
