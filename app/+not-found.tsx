import { Feather } from "@expo/vector-icons";
import { Stack, useRouter, type Href } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/buttons/Button";
import { landingAssets } from "@/config/landingAssets";
import { getDashboardPath, type UserRole } from "@/config/roleRoutes";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColors";

/** Any address the app does not know. Sends people to their dashboard, or the sign-in page. */
const NotFoundScreen = () => {
  const colors = useThemeColors();
  const router = useRouter();
  const { user } = useAuth();
  const home = (user ? getDashboardPath(user.role as UserRole) : "/") as Href;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }}>
      <Stack.Screen options={{ title: "Page not found" }} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <View style={{ width: "100%", maxWidth: 420, alignItems: "center", gap: 16 }}>
          <Image
            source={landingAssets.brandMark}
            style={{ width: 72, height: 72 }}
            accessibilityIgnoresInvertColors
            accessible={false}
          />
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text
              role="heading"
              aria-level={1}
              style={{ fontSize: 26, lineHeight: 32, fontWeight: "800", color: colors.heading, textAlign: "center" }}
            >
              Page not found
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 22, color: colors.muted, textAlign: "center" }}>
              This link may be old or mistyped. Your appointments and records are safe.
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Feather name="compass" size={15} color={colors.subtle} />
            <Text style={{ fontSize: 13, color: colors.subtle }}>MaslogCare, Barangay 61 Maslog</Text>
          </View>
          <Button
            label={user ? "Go to my dashboard" : "Go to sign in"}
            icon="arrow-right"
            iconPosition="right"
            onPress={() => router.replace(home)}
            style={{ marginTop: 8, alignSelf: "center" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotFoundScreen;
