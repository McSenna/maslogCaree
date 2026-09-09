import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import UserAvatar from "@/components/ui/UserAvatar";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { IS_WEB_PLATFORM } from "@/config/platformAccess";
import { ProfileModal } from "@/features/profile";
import LogoutConfirmModal from "@/features/profile/components/LogoutConfirmModal";
import { useAuth } from "@/contexts/AuthContext";
import { getProfilePath, type UserRole } from "@/data/mockUsers";
import { formatRoleLabel } from "@/utils/roleLabel";
import { getHeaderPalette, HEADER_FONT } from "./headerTokens";
import ProfileDropdown, {
  type ProfileAnchor,
  type ProfileMenuItem,
} from "./ProfileDropdown";

type HeaderProfileProps = {
  compact: boolean;
  isDark: boolean;
  /** Name + role beside the avatar (tablet and up, when width allows). */
  showIdentity: boolean;
  /** Role line + chevron (desktop). */
  showDetails: boolean;
};

const HeaderProfile = ({
  compact,
  isDark,
  showIdentity,
  showDetails,
}: HeaderProfileProps) => {
  const palette = getHeaderPalette(isDark);
  const { user, logout } = useAuth();
  const router = useRouter();

  const anchorRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<ProfileAnchor | null>(null);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { width } = useWindowDimensions();

  /**
   * The web client shows the profile as a modal over the dashboard; the native
   * client navigates to the full-screen profile route (§2). A narrow browser
   * window has no room for the modal, so it follows the mobile path.
   */
  const useProfileModal = IS_WEB_PLATFORM && width >= BREAKPOINTS.tablet;

  const chevronAnim = useRef(new Animated.Value(0)).current;

  const avatarSize = compact ? 32 : 40;
  const role = (user?.role ?? "resident") as UserRole;
  const roleLabel = formatRoleLabel(user?.role);

  const animateChevron = useCallback(
    (toValue: number) => {
      Animated.timing(chevronAnim, {
        toValue,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
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
      {
        key: "profile",
        label: "My Profile",
        icon: "user",
        onPress: openProfile,
      },
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

    // Phones open the profile directly — there is no room for a menu.
    if (compact) {
      openProfile();
      return;
    }

    if (open) {
      closeMenu();
      return;
    }

    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
      animateChevron(1);
    });
  }, [animateChevron, closeMenu, compact, open, openProfile, user]);

  const rotate = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <>
      <Pressable
        ref={anchorRef}
        accessibilityRole="button"
        accessibilityLabel={
          user ? `Open profile menu for ${user.name}` : "Open profile"
        }
        accessibilityState={{ expanded: open }}
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: compact ? 0 : 10,
          borderRadius: 999,
          paddingLeft: 0,
          paddingRight: showDetails ? 4 : 0,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            borderWidth: 1,
            borderColor: palette.avatarRing,
            overflow: "hidden",
          }}
        >
          <UserAvatar
            size={avatarSize - 2}
            imageUrl={user?.avatarUrl ?? null}
            accessibilityLabel="Profile photo"
            fallbackBackgroundColor={palette.avatarFallbackBg}
            fallbackIconColor={palette.avatarFallbackIcon}
          />
        </View>

        {showIdentity && (
          <View style={{ maxWidth: 180, minWidth: 0 }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: HEADER_FONT,
                fontSize: 14.5,
                lineHeight: 18,
                fontWeight: "600",
                color: palette.title,
              }}
            >
              {user?.name ?? "Guest"}
            </Text>

            {showDetails && !!roleLabel && (
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: HEADER_FONT,
                  fontSize: 12,
                  lineHeight: 15,
                  fontWeight: "400",
                  color: palette.muted,
                  marginTop: 1,
                }}
              >
                {roleLabel}
              </Text>
            )}
          </View>
        )}

        {showIdentity && (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Feather name="chevron-down" size={18} color={palette.muted} />
          </Animated.View>
        )}
      </Pressable>

      <ProfileDropdown
        visible={open}
        onClose={closeMenu}
        anchor={anchor}
        items={menuItems}
        isDark={isDark}
      />

      {useProfileModal ? (
        <ProfileModal
          visible={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      ) : null}

      <LogoutConfirmModal
        visible={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default HeaderProfile;
