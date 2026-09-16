import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { buildProfileData, type ProfileData } from "../utils/profileData";
import { useEditProfile } from "./useEditProfile";
import type { ProfileNotice } from "../components/ProfileNoticeModal";

const PENDING_FEATURES: Record<string, ProfileNotice> = {
  changePassword: {
    title: "Change Password",
    message:
      "Password changes will be available once the MaslogCare password service is connected.",
  },
  notificationSettings: {
    title: "Notification Settings",
    message:
      "Notification preferences will be available once MaslogCare can store them for your account.",
  },
  privacySecurity: {
    title: "Privacy & Security",
    message:
      "Security preferences will be available once the MaslogCare security service is connected.",
  },
  helpCenter: {
    title: "Help Center",
    message:
      "The MaslogCare Help Center is being prepared. For now, please contact your barangay health office.",
  },
  contactSupport: {
    title: "Contact Support",
    message:
      "Please reach out to your barangay health office, or email support@maslogcare.ph for assistance.",
  },
};

const getAppVersion = (): string | undefined => {
  const version = Constants.expoConfig?.version;
  return version ? `v${version}` : undefined;
};

export type ProfileState = {
  profile: ProfileData | null;
  loading: boolean;
  failed: boolean;
  appVersion?: string;

  notice: ProfileNotice | null;
  dismissNotice: () => void;

  logoutVisible: boolean;
  loggingOut: boolean;
  requestLogout: () => void;
  cancelLogout: () => void;
  confirmLogout: () => void;

  retry: () => void;

  edit: ReturnType<typeof useEditProfile>;

  onEditProfile: () => void;
  onChangePhoto: () => void;
  onChangePassword: () => void;
  onNotificationSettings: () => void;
  onPrivacySecurity: () => void;
  onHelpCenter: () => void;
  onContactSupport: () => void;
  onAbout: () => void;
};

export const useProfile = (options: { onAfterLogout?: () => void } = {}): ProfileState => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { onAfterLogout } = options;

  const edit = useEditProfile();

  const [notice, setNotice] = useState<ProfileNotice | null>(null);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profile = useMemo(
    () => (user ? buildProfileData(user) : null),
    [user]
  );

  const showPending = useCallback((key: keyof typeof PENDING_FEATURES) => {
    setNotice(PENDING_FEATURES[key]);
  }, []);

  const confirmLogout = useCallback(() => {
    setLoggingOut(true);
    logout();
    setLogoutVisible(false);
    setLoggingOut(false);
    onAfterLogout?.();
    router.replace("/");
  }, [logout, onAfterLogout, router]);

  const retry = useCallback(() => {
    router.replace("/");
  }, [router]);

  return {
    profile,
    loading: isLoading,
    failed: !isLoading && !user,
    appVersion: getAppVersion(),

    notice,
    dismissNotice: () => setNotice(null),

    logoutVisible,
    loggingOut,
    requestLogout: () => setLogoutVisible(true),
    cancelLogout: () => setLogoutVisible(false),
    confirmLogout,

    retry,

    edit,

    onEditProfile: edit.openEditProfile,
    onChangePhoto: edit.changeAvatar,
    onChangePassword: () => showPending("changePassword"),
    onNotificationSettings: () => showPending("notificationSettings"),
    onPrivacySecurity: () => showPending("privacySecurity"),
    onHelpCenter: () => showPending("helpCenter"),
    onContactSupport: () => showPending("contactSupport"),
    onAbout: () =>
      setNotice({
        title: "About MaslogCare",
        message: `MaslogCare ${getAppVersion() ?? ""}\n\nHealthy Residents, Stronger Community.`.trim(),
      }),
  };
};
