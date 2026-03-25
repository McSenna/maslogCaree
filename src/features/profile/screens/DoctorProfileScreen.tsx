import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Platform } from "react-native";
import { ScrollView } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHeader, ProfileMenuSection } from "@/features/profile/components";

type DoctorProfileScreenProps = {
  onNavigateToProfileEdit?: () => void;
  onNavigateToHelp?: () => void;
  onNavigateToSettings?: () => void;
  onLogout?: () => void;
};

const buildAccountItems = (handlers: DoctorProfileScreenProps) => [
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

const buildSupportItems = (handlers: DoctorProfileScreenProps) => [
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

export default function DoctorProfileScreen(props?: DoctorProfileScreenProps) {
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

  const handleSettings = handlers.onNavigateToSettings ?? (() => router.push("/doctor/dashboard" as any));
  const accountItems = buildAccountItems({ ...handlers, onNavigateToSettings: handleSettings, onLogout: handleLogout });
  const supportItems = buildSupportItems({ ...handlers, onLogout: handleLogout });

  const profileUser = {
    fullname: user?.name ?? "Doctor User",
    email: user?.email ?? "",
    bio: "Licensed physician.",
    role: "Doctor",
    verified: true,
    avatarUrl: user?.avatarUrl ?? null,
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="gap-4 px-4 py-4 pb-10"
    >
      <ProfileHeader user={profileUser} />
      <ProfileMenuSection title="Account" items={accountItems} />
      <ProfileMenuSection title="Support" items={supportItems} />
    </ScrollView>
  );
}
