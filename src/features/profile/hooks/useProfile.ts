import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { buildProfileData, type ProfileData } from "../utils/profileData";
import type { ProfileNotice } from "../components/ProfileNoticeModal";

/**
 * Copy for the actions whose screens exist in the design but have no MaslogCare
 * endpoint behind them yet. Kept together so there is one obvious list of what
 * still needs wiring, rather than the same sentence written six times.
 */
const PENDING_FEATURES: Record<string, ProfileNotice> = {
  editProfile: {
    title: "Editing not available yet",
    message:
      "Updating your profile details will be enabled once the MaslogCare profile update service is connected.",
  },
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

function getAppVersion(): string | undefined {
  const version = Constants.expoConfig?.version;
  return version ? `v${version}` : undefined;
}

export type ProfileState = {
  profile: ProfileData | null;
  loading: boolean;
  /** True when the session finished restoring but produced no user. */
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

  onEditProfile: () => void;
  onChangePhoto: () => void;
  onChangePassword: () => void;
  onNotificationSettings: () => void;
  onPrivacySecurity: () => void;
  onHelpCenter: () => void;
  onContactSupport: () => void;
  onAbout: () => void;
};

/**
 * Everything the profile needs, for every role and both platforms.
 *
 * The web modal and the mobile screen are two presentations of this one hook,
 * which is what keeps role handling from being duplicated across five screens.
 */
export function useProfile(options: { onAfterLogout?: () => void } = {}): ProfileState {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { onAfterLogout } = options;

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
    // The profile is rendered from the session, so recovering means signing in
    // again rather than refetching a resource.
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

    onEditProfile: () => showPending("editProfile"),
    onChangePhoto: () => showPending("editProfile"),
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
}
