import { useCallback, useMemo, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";

import { IS_WEB_PLATFORM } from "@/config/platformAccess";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { useAuth } from "@/contexts/AuthContext";
import { getProfilePath, type UserRole } from "@/data/mockUsers";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";

import type { ProfileAnchor, ProfileMenuItem } from "../ProfileDropdown";
import { USE_NATIVE_DRIVER } from "@/design/motion";

export const useHeaderProfileMenu = (compact: boolean, width: number) => {
  const { user, isLoading, logout } = useAuth();
  const router = useGuardedNavigation();

  const anchorRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<ProfileAnchor | null>(null);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const useProfileModal = IS_WEB_PLATFORM && width >= BREAKPOINTS.tablet;
  const chevronAnim = useRef(new Animated.Value(0)).current;

  const role = (user?.role ?? "resident") as UserRole;

  const animateChevron = useCallback(
    (toValue: number) => {
      Animated.timing(chevronAnim, {
        toValue,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    },
    [chevronAnim]
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
    animateChevron(0);
  }, [animateChevron]);

  const handleLogout = useCallback(() => setLogoutOpen(true), []);

  const confirmLogout = useCallback(() => {
    setLogoutOpen(false);
    logout();
    router.replace("/");
  }, [logout, router]);

  const openProfile = useCallback(() => {
    if (useProfileModal) {
      setProfileOpen(true);
      return;
    }
    router.push(getProfilePath(role) as any);
  }, [role, router, useProfileModal]);

  const menuItems = useMemo<ProfileMenuItem[]>(
    () => [
      { key: "profile", label: "My Profile", icon: "user", onPress: openProfile },
      {
        key: "logout",
        label: "Logout",
        icon: "log-out",
        danger: true,
        onPress: handleLogout,
      },
    ],
    [handleLogout, openProfile]
  );

  const handlePress = useCallback(() => {
    if (!user) return;

    if (compact) {
      openProfile();
      return;
    }

    if (open) {
      closeMenu();
      return;
    }

    anchorRef.current?.measureInWindow((x, y, measuredWidth, height) => {
      setAnchor({ x, y, width: measuredWidth, height });
      setOpen(true);
      animateChevron(1);
    });
  }, [animateChevron, closeMenu, compact, open, openProfile, user]);

  return {
    user,
    sessionResolved: !isLoading || Boolean(user),
    anchorRef,
    anchor,
    open,
    profileOpen,
    closeProfileModal: () => setProfileOpen(false),
    logoutOpen,
    cancelLogout: () => setLogoutOpen(false),
    confirmLogout,
    useProfileModal,
    menuItems,
    closeMenu,
    handlePress,
    rotate: chevronAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }),
  };
};
