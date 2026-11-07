import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import StatePressable from "@/components/ui/StatePressable";

import UserAvatar from "@/components/ui/UserAvatar";
import type { CurrentUser } from "@/contexts/AuthContext";
import { getDashboardPath, getProfilePath } from "@/config/roleRoutes";
import { useResponsive } from "@/hooks/useResponsive";
import { PALETTE, withAlpha } from "@/theme/palette";

type Props = {
  isMobile: boolean;
  user?: CurrentUser | null;
  onPressLogin: () => void;
};

const PILL_TEXT = PALETTE.blue[900];

// Below this the brand and a Login button with its icon do not fit on one row.
const LOGIN_ICON_MIN_WIDTH = 360;
const MIN_TOUCH_TARGET = 44;

const pillStyle = (isMobile: boolean) => ({ pressed }: { pressed: boolean }) => ({
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 8,
  minHeight: MIN_TOUCH_TARGET,
  borderRadius: 8,
  paddingHorizontal: isMobile ? 14 : 18,
  paddingVertical: isMobile ? 10 : 11,
  backgroundColor: PALETTE.white,
  transform: [{ scale: pressed ? 0.97 : 1 }],
  opacity: pressed ? 0.9 : 1,
});

const PillIcon = ({ name }: { name: "layout" | "user" }) => (
  <View
    style={{
      width: 28,
      height: 28,
      borderRadius: 6,
      backgroundColor: PALETTE.blue[50],
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Feather name={name} size={15} color={PALETTE.blue[600]} />
  </View>
);

const HeaderActions = ({ isMobile, user, onPressLogin }: Props) => {
  const router = useRouter();
  const { width } = useResponsive();

  return (
    <View
      style={{ flexShrink: 0, flexDirection: "row", alignItems: "center", gap: 8 }}
    >
      {user ? (
        <>
          <StatePressable
            onPress={() => router.push(getProfilePath(user.role))}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: withAlpha(PALETTE.white, 0.2),
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: withAlpha(PALETTE.white, 0.4),
              transform: [{ scale: pressed ? 0.96 : 1 }],
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <UserAvatar
              size={34}
              imageUrl={user?.avatarUrl ?? null}
              accessibilityLabel="Profile photo"
            />
          </StatePressable>

          <Pressable
            onPress={() => router.push(getDashboardPath(user.role))}
            accessibilityRole="button"
            accessibilityLabel="Go to dashboard"
            style={pillStyle(isMobile)}
          >
            <PillIcon name="layout" />

            {!isMobile && (
              <Text style={{ fontSize: 16, fontWeight: "700", color: PILL_TEXT }}>
                Dashboard
              </Text>
            )}
          </Pressable>
        </>
      ) : (
        <Pressable onPress={onPressLogin} accessibilityRole="button" accessibilityLabel="Log in" style={pillStyle(isMobile)}>
          {width >= LOGIN_ICON_MIN_WIDTH ? <PillIcon name="user" /> : null}

          <Text
            style={{
              fontSize: isMobile ? 15 : 16,
              fontWeight: "700",
              color: PILL_TEXT,
            }}
          >
            Login
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default HeaderActions;
