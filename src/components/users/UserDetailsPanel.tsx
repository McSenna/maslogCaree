import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import type { AdminUser } from "@/services/userService";
import UserDetailsError from "./details/UserDetailsError";
import UserDetailsSkeleton from "./details/UserDetailsSkeleton";
import UserInformationCard from "./details/UserInformationCard";
import UserModalActions from "./details/UserModalActions";
import UserPermissionsCard from "./details/UserPermissionsCard";
import UserPlatformAccessCard from "./details/UserPlatformAccessCard";
import UserProfileHero from "./details/UserProfileHero";
import { DETAIL_RADIUS, useUserDetailsPalette } from "./details/detailsTheme";

/** Full desktop width for the dialog, before the viewport clamps it. */
const MAX_WIDTH = 1000;

/**
 * Below this the two columns would each be too narrow to hold a label and its
 * value on one line, so the sections stack instead of squeezing.
 */
const TWO_COLUMN_WIDTH = 900;

const TITLE_ID = "user-details-title";

/**
 * Names the dialog after its own heading.
 *
 * Passed to `Modal` rather than to the card inside it: react-native-web's Modal
 * already renders the `role="dialog"` / `aria-modal` element and forwards any
 * extra props onto it, so labelling the inner card instead would leave the real
 * dialog unnamed and announce a second, nested one. No native equivalent, and
 * none needed — `Modal` is already a modal surface there.
 */
const dialogAccessibilityProps =
  Platform.OS === "web" ? ({ "aria-labelledby": TITLE_ID } as object) : {};

function ModalHeader({ onClose }: { onClose: () => void }) {
  const palette = useUserDetailsPalette();
  const [hovered, setHovered] = useState(false);

  return (
    <View className="w-full flex-row items-start justify-between gap-4">
      <View className="min-w-0 flex-1 flex-row items-center gap-3.5">
        <View
          className="h-11 w-11 items-center justify-center"
          style={{ borderRadius: DETAIL_RADIUS.control, backgroundColor: palette.headerWell }}
        >
          <Feather name="user" size={20} color={palette.headerIcon} />
        </View>
        <View className="min-w-0 flex-1">
          <Text
            nativeID={TITLE_ID}
            accessibilityRole="header"
            className="text-[24px] font-bold"
            style={{ color: palette.heading }}
          >
            User Details
          </Text>
          <Text className="mt-0.5 text-[13.5px]" style={{ color: palette.muted }}>
            Manage account information and access
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onClose}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        accessibilityRole="button"
        accessibilityLabel="Close user details"
        hitSlop={10}
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: hovered ? palette.divider : palette.headerWell }}
      >
        <Feather name="x" size={18} color={palette.headerIcon} />
      </Pressable>
    </View>
  );
}

type UserDetailsPanelProps = {
  visible: boolean;
  /** Null while the record is loading, or when it could not be read at all. */
  user: AdminUser | null;
  onClose: () => void;
  onChangeStatus: (user: AdminUser) => void;
  onViewActivity: (user: AdminUser) => void;
  /** True while this user's status change is in flight. */
  busy?: boolean;
  loading?: boolean;
  /** Why the record is missing, when it is not simply still loading. */
  error?: string | null;
  onRetry?: () => void;
};

/**
 * User details.
 *
 * A wide centred dialog rather than a side panel: the table is specified to
 * fill the content area at 1920px, and a permanent column beside it would take
 * roughly a fifth of that width away from the nine columns. Wide enough for two
 * content columns, so identity, contact, role and platform all land in one
 * screen instead of behind a scroll.
 */
export default function UserDetailsPanel({
  visible,
  user,
  onClose,
  onChangeStatus,
  onViewActivity,
  busy = false,
  loading = false,
  error = null,
  onRetry,
}: UserDetailsPanelProps) {
  const palette = useUserDetailsPalette();
  const { width, height } = useWindowDimensions();

  useWebModalBehavior(visible, onClose);
  const setDialogNode = useFocusTrap(visible);

  // Opacity and scale only, and briefly — the dialog is opened dozens of times
  // in a session, so anything with travel or bounce becomes a tax on the work
  // rather than a cue that something appeared.
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      enter.setValue(0);
      return;
    }
    Animated.timing(enter, {
      toValue: 1,
      duration: 180,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [visible, enter]);

  if (!visible) return null;

  const compact = width < TWO_COLUMN_WIDTH;
  const dialogWidth = Math.min(MAX_WIDTH, width * (width < 640 ? 0.94 : 0.92));

  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      {...dialogAccessibilityProps}
    >
      <View className="flex-1 items-center justify-center p-4">
        {/* The dashboard stays faintly readable behind the dialog, so the admin
            keeps their place in the table they came from. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close user details"
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(15,23,42,0.35)",
            ...(Platform.OS === "web" ? ({ backdropFilter: "blur(3px)" } as object) : null),
          }}
        />

        <Animated.View
          ref={setDialogNode}
          className="w-full border"
          style={{
            width: dialogWidth,
            maxWidth: MAX_WIDTH,
            maxHeight: height * 0.9,
            borderRadius: DETAIL_RADIUS.modal,
            backgroundColor: palette.cardBg,
            borderColor: palette.cardBorder,
            opacity: enter,
            transform: [{ scale }],
            shadowColor: "#0F2557",
            shadowOpacity: 0.22,
            shadowRadius: 40,
            shadowOffset: { width: 0, height: 18 },
            elevation: 16,
          }}
        >
          <View className="px-7 pb-5 pt-7">
            <ModalHeader onClose={onClose} />
          </View>

          {/* Only this area scrolls — the header stays put and the actions stay
              reachable, so a tall record never buries the buttons. */}
          <ScrollView
            className="w-full"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 8 }}
          >
            {error && !user ? (
              <UserDetailsError onRetry={onRetry} message={error} />
            ) : !user || loading ? (
              <UserDetailsSkeleton compact={compact} />
            ) : (
              <View className="w-full gap-5">
                <UserProfileHero user={user} compact={compact} />

                <View className={`w-full gap-5 ${compact ? "flex-col" : "flex-row items-stretch"}`}>
                  <View className="min-w-0 flex-1">
                    <UserInformationCard user={user} />
                  </View>
                  <View className="min-w-0 flex-1 gap-5">
                    <UserPermissionsCard user={user} />
                    <UserPlatformAccessCard user={user} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {user && !error ? (
            <View
              className="px-7 pb-7 pt-5"
              style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
            >
              <UserModalActions
                user={user}
                busy={busy}
                compact={compact}
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
