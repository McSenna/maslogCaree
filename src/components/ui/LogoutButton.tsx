import { Alert, Platform, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

export type LogoutButtonProps = {
  label?: string;
  confirm?: boolean;
  className?: string;
};

const LogoutButton = ({
  label = "Log out",
  confirm = true,
  className = "",
}: LogoutButtonProps) => {
  const { logout } = useAuth();
  const router = useRouter();

  const doLogout = () => {
    logout();
    router.replace("/");
  };

  const onPress = () => {
    if (!confirm) {
      doLogout();
      return;
    }

    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.confirm("Are you sure you want to logout?")) doLogout();
      return;
    }

    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: label, style: "destructive", onPress: doLogout },
    ]);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={[
        "w-full rounded-2xl bg-rose-500 px-4 py-3 items-center justify-center",
        "shadow-sm shadow-rose-500/25 active:opacity-90",
        className,
      ].join(" ")}
    >
      <Text className="text-white font-semibold">{label}</Text>
    </Pressable>
  );
};

export default LogoutButton;

