import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { describePlatformAccess } from "@/config/platformAccess";
import { useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import type { AdminUser } from "@/services/userService";
import RoleBadge from "../RoleBadge";
import SheetSection from "./SheetSection";
import UserDetailsError from "./UserDetailsError";
import UserModalActions from "./UserModalActions";
import { PlatformAccessRows } from "./UserPlatformAccessCard";
import UserProfileSummary from "./UserProfileSummary";
import UserSheetSkeleton from "./UserSheetSkeleton";
import { ROLE_PERMISSIONS, useUserDetailsPalette } from "./detailsTheme";
import { InfoRows, buildAccountRows, buildPersonalRows } from "./userDetailRows";

const TITLE_ID = "user-details-sheet-title";

/** Names the sheet after its own heading; see the desktop dialog for why this
 *  goes on `Modal` rather than on the surface inside it. */
const dialogAccessibilityProps =
  Platform.OS === "web" ? ({ "aria-labelledby": TITLE_ID } as object) : {};

/** Past this much drag, or this fast a flick, releasing dismisses the sheet. */
const DISMISS_DISTANCE = 96;
const DISMISS_VELOCITY = 0.75;

/**
 * Below this the two actions stack rather than sharing a row.
 *
 * Set by the longer label, not by a device class: side by side on a 390px
 * phone, "View Activity Logs" wraps to two lines inside its button. Stacking
 * gives both actions the full width and a clean 52px thumb target, which is
 * what nearly every phone gets.
 */
const NARROW_WIDTH = 480;

type UserDetailsSheetProps = {
  visible: boolean;
  /** Null while the record is loading, or when it could not be read at all. */
  user: AdminUser | null;
  onClose: () => void;
  onChangeStatus: (user: AdminUser) => void;
  onViewActivity: (user: AdminUser) => void;
  busy?: boolean;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

/**
 * User details — the phone presentation.
 *
 * A bottom sheet rather than the desktop's centred dialog, matching Inventory:
 * the card list is the whole screen on a phone, so the details rise over it and
 * dismiss back down to it, and every control stays inside thumb reach instead
 * of floating in the middle of the display.
 *
 * The handle and header are fixed, the middle scrolls, and the actions sit on
 * the bottom edge above the gesture bar — so on a long record the admin never
 * has to scroll to find the way out or the way to act.
 */
export default function UserDetailsSheet({
  visible,
  user,
  onClose,
  onChangeStatus,
  onViewActivity,
  busy = false,
  loading = false,
  error = null,
  onRetry,
}: UserDetailsSheetProps) {
  const palette = useUserDetailsPalette();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();

  useWebModalBehavior(visible, onClose);

  // Drag offset for pull-to-dismiss. Native-driven: it only moves a transform,
  // so the gesture stays smooth while the sheet's contents are laid out.
  const dragY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) dragY.setValue(0);
  }, [visible, dragY]);

  const dismiss = useRef(onClose);
  dismiss.current = onClose;

  /**
   * Attached to the handle and header only, never to the scrolling body.
   *
   * A sheet that also grabs downward drags on its content has to guess whether
   * the admin meant to scroll up or to dismiss, and it guesses wrong often
   * enough to feel broken. Confining the gesture to the header means the two
   * can never contend, at the cost of a smaller grab area — which is exactly
   * what the handle is there to advertise.
   */
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          gesture.dy > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderMove: (_event, gesture) => {
          if (gesture.dy > 0) dragY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_event, gesture) => {
          const shouldDismiss = gesture.dy > DISMISS_DISTANCE || gesture.vy > DISMISS_VELOCITY;

          if (shouldDismiss) {
            Animated.timing(dragY, {
              toValue: height,
              duration: 180,
              useNativeDriver: true,
            }).start(() => dismiss.current());
            return;
          }

          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
            speed: 18,
          }).start();
        },
      }),
    [dragY, height]
  );

  if (!visible) return null;

  const access = user ? user.platformAccess ?? describePlatformAccess(user.role) : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      // Android's hardware/gesture Back closes the sheet, not the screen behind.
      onRequestClose={onClose}
      statusBarTranslucent
      {...dialogAccessibilityProps}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,23,42,0.35)" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close user details"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <Animated.View
          className="w-full overflow-hidden"
          style={{
            // Never the full screen: the list stays visible above it, so the
            // sheet reads as a layer over User Management rather than a new page.
            maxHeight: height * 0.92,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: palette.cardBg,
            transform: [{ translateY: dragY }],
            shadowColor: "#0F2557",
            shadowOpacity: 0.2,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: -6 },
            elevation: 16,
          }}
        >
          {/* Handle + header: fixed, and the only place the dismiss drag lives. */}
          <View {...panResponder.panHandlers}>
            <View className="items-center pb-1 pt-2.5">
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }}
              />
            </View>

            <View
              className="flex-row items-center justify-between gap-3 px-4 pb-3 pt-1"
              style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
            >
              <View className="min-w-0 flex-1">
                <Text
                  nativeID={TITLE_ID}
                  accessibilityRole="header"
                  className="text-[17px] font-bold"
                  style={{ color: palette.heading }}
                >
                  User Details
                </Text>
                <Text className="mt-0.5 text-[12.5px]" style={{ color: palette.muted }}>
                  Account information and access
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close user details"
                // 16px glyph carried to a 44px touch target by hitSlop.
                hitSlop={14}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: palette.headerWell }}
              >
                <Feather name="x" size={17} color={palette.headerIcon} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {error && !user ? (
              <UserDetailsError onRetry={onRetry} message={error} />
            ) : !user || loading ? (
              <UserSheetSkeleton />
            ) : (
              <View className="w-full gap-5 pb-1 pt-3">
                <UserProfileSummary user={user} />

                <SheetSection title="Personal Information">
                  <InfoRows rows={buildPersonalRows(user)} compact />
                </SheetSection>

                <SheetSection title="Role & Permissions">
                  <View className="gap-2 pt-1">
                    <RoleBadge role={user.role} />
                    <Text className="text-[13px] leading-[19px]" style={{ color: palette.body }}>
                      {ROLE_PERMISSIONS[user.role]}
                    </Text>
                  </View>
                </SheetSection>

                <SheetSection title="Platform Access">
                  <PlatformAccessRows user={user} />
                  {access && !access.web ? (
                    <Text className="pb-1 pt-1 text-[12.5px]" style={{ color: palette.subtle }}>
                      This account can only sign in through the MaslogCare mobile application.
                    </Text>
                  ) : null}
                </SheetSection>

                <SheetSection title="Account Information" quiet>
                  <InfoRows rows={buildAccountRows(user)} compact />
                </SheetSection>
              </View>
            )}
          </ScrollView>

          {/* Actions stay put while the details scroll, and clear the Android
              gesture bar / home indicator via the bottom inset. */}
          {user && !error ? (
            <View
              className="w-full px-4 pt-3"
              style={{
                borderTopWidth: 1,
                borderTopColor: palette.divider,
                paddingBottom: Math.max(insets.bottom, 12) + 4,
              }}
            >
              <UserModalActions
                user={user}
                busy={busy}
                compact={width < NARROW_WIDTH}
                destructiveLast
                onChangeStatus={() => onChangeStatus(user)}
                onViewActivity={() => onViewActivity(user)}
              />
            </View>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}
