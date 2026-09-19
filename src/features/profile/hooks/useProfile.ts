import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { buildProfileData, type ProfileData } from "../utils/profileData";
import { useEditProfile } from "./useEditProfile";
import type { ProfileNotice } from "../components/ProfileNoticeModal";
import { useProfileHelpSupport, type ProfileHelpSupportState } from "./useProfileHelpSupport";

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

  aboutVisible: boolean;
  closeAbout: () => void;

  changePasswordVisible: boolean;
  openChangePassword: () => void;
  closeChangePassword: () => void;

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
  onAbout: () => void;
} & ProfileHelpSupportState;

type ProfileOptions = { onAfterLogout?: () => void };

export const useProfile = (options: ProfileOptions = {}): ProfileState => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { onAfterLogout } = options;

  const edit = useEditProfile();
  const helpSupport = useProfileHelpSupport();

  const [notice, setNotice] = useState<ProfileNotice | null>(null);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
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

    aboutVisible,
    closeAbout: () => setAboutVisible(false),

    changePasswordVisible,
    openChangePassword: () => setChangePasswordVisible(true),
    closeChangePassword: () => setChangePasswordVisible(false),

    logoutVisible,
    loggingOut,
    requestLogout: () => setLogoutVisible(true),
    cancelLogout: () => setLogoutVisible(false),
    confirmLogout,

    retry,

    edit,

    onEditProfile: () => edit.startEditing("personal"),
    onChangePhoto: edit.changeAvatar,
    onChangePassword: () => setChangePasswordVisible(true),
    onNotificationSettings: () => showPending("notificationSettings"),
    onAbout: () => setAboutVisible(true),

    ...helpSupport,
  };
};
