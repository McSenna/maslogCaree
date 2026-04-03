import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Platform, ScrollView, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import {
  ProfileIdentityCard,
  ProfileMenuSection,
  ThemePreferenceEndSlot,
} from "@/features/profile/components";

type BhwProfileScreenProps = {
  onNavigateToProfileEdit?: () => void;
  onNavigateToHelp?: () => void;
  onNavigateToSettings?: () => void;
  onLogout?: () => void;
};

const buildAccountItems = (handlers: BhwProfileScreenProps) => [
  {
    label: "Manage Profile",
    icon: <Feather name="user" size={18} color="#6b7280" />,
    onPress: handlers.onNavigateToProfileEdit,
  },
  {
    label: "Password & Security",
    icon: <Feather name="lock" size={18} color="#6b7280" />,
    onPress: handlers.onNavigateToSettings,
  },
  {
    label: "Notifications",
    icon: <Feather name="bell" size={18} color="#6b7280" />,
    onPress: undefined,
  },
];

const buildPreferenceItems = (router: ReturnType<typeof useRouter>) => [
  {
    label: "Dark mode",
    icon: <Feather name="moon" size={18} color="#6b7280" />,
    endSlot: <ThemePreferenceEndSlot />,
  },
  {
    label: "About",
    icon: <Feather name="info" size={18} color="#6b7280" />,
    onPress: () => router.push("/about" as any),
  },
];

const buildSupportItems = (handlers: BhwProfileScreenProps) => [
  {
    label: "Help Center",
    icon: <Feather name="help-circle" size={18} color="#6b7280" />,
    onPress: handlers.onNavigateToHelp,
  },
  {
    label: "Log out",
    icon: <Feather name="log-out" size={18} color="#ef4444" />,
    variant: "danger" as const,
    onPress: handlers.onLogout,
  },
];

export default function BhwProfileScreen(props?: BhwProfileScreenProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const handlers = props ?? {};

  const handleLogout = handlers.onLogout ?? (() => {
    const doLogout = () => {
      logout();
      router.replace("/");
    };
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.confirm("Are you sure you want to logout?")) doLogout();
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: doLogout },
      ]);
    }
  });

  const handleSettings = handlers.onNavigateToSettings ?? (() => router.push("/bhw/dashboard" as any));
  const accountItems = buildAccountItems({ ...handlers, onNavigateToSettings: handleSettings, onLogout: handleLogout });
  const supportItems = buildSupportItems({ ...handlers, onLogout: handleLogout });

  const profileUser = {
    fullname: user?.name ?? "BHW User",
    email: user?.email ?? "",
    role: "BHW",
    verified: false,
    avatarUrl: user?.avatarUrl ?? null,
    address: user?.address ?? null,
    gender: user?.gender ?? null,
    dateOfBirth: user?.dateOfBirth ?? null,
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full max-w-[980px] self-center">
        <View className="gap-5">
          <ProfileIdentityCard user={profileUser} />
          <ProfileMenuSection title="Account" items={accountItems} />
          <ProfileMenuSection title="Preferences" items={buildPreferenceItems(router)} />
          <ProfileMenuSection title="Support" items={supportItems} />
        </View>
      </View>
    </ScrollView>
  );
}
