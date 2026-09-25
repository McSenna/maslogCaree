import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import UserAvatar from "@/components/ui/UserAvatar";
import type { CurrentUser } from "@/contexts/AuthContext";
import { getDashboardPath, getProfilePath } from "@/config/roleRoutes";

type Props = {
  isMobile: boolean;
  user?: CurrentUser | null;
  onPressLogin: () => void;
};

const PILL_TEXT = "#0C1F6E";

const pillStyle = (isMobile: boolean) => ({ pressed }: { pressed: boolean }) => ({
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 8,
  borderRadius: 999,
  paddingHorizontal: isMobile ? 14 : 18,
  paddingVertical: isMobile ? 10 : 11,
  backgroundColor: "#FFFFFF",
  transform: [{ scale: pressed ? 0.97 : 1 }],
  opacity: pressed ? 0.9 : 1,
});

const PillIcon = ({ name }: { name: "layout" | "user" }) => (
  <View
    style={{
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "#EFF6FF",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Feather name={name} size={15} color="#2D5BFF" />
  </View>
);

const HeaderActions = ({ isMobile, user, onPressLogin }: Props) => {
  const router = useRouter();

  return (
    <View
      style={{ flexShrink: 0, flexDirection: "row", alignItems: "center", gap: 8 }}
    >
      {user ? (
        <>
          <Pressable
            onPress={() => router.push(getProfilePath(user.role))}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.4)",
              transform: [{ scale: pressed ? 0.96 : 1 }],
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <UserAvatar
              size={34}
              imageUrl={user?.avatarUrl ?? null}
              accessibilityLabel="Profile photo"
            />
          </Pressable>

          <Pressable
            onPress={() => router.push(getDashboardPath(user.role))}
            accessibilityRole="button"
            accessibilityLabel="Go to dashboard"
            style={pillStyle(isMobile)}
          >
            <PillIcon name="layout" />

            {!isMobile && (
              <Text style={{ fontSize: 14, fontWeight: "700", color: PILL_TEXT }}>
                Dashboard
              </Text>
            )}
          </Pressable>
        </>
      ) : (
        <Pressable onPress={onPressLogin} accessibilityRole="button" accessibilityLabel="Log in" style={pillStyle(isMobile)}>
          <PillIcon name="user" />

          <Text
            style={{
              fontSize: isMobile ? 13 : 14,
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
