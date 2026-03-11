import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import ProfileMenuItem from "./ProfileMenuItem";

type ProfileMenuProps = {
  onNavigateToProfileEdit?: () => void;
  onNavigateToAddress?: () => void;
  onNavigateToHelp?: () => void;
  onNavigateToSettings?: () => void;
  onLogout?: () => void;
};

export default function ProfileMenu({
  onNavigateToProfileEdit,
  onNavigateToAddress,
  onNavigateToHelp,
  onNavigateToSettings,
  onLogout,
}: ProfileMenuProps) {
  return (
    <View className="gap-3">
      <ProfileMenuItem
        label="My Profile"
        icon={<Feather name="user" size={18} color="#0F766E" />}
        onPress={onNavigateToProfileEdit}
      />
      <ProfileMenuItem
        label="Address Management"
        icon={<Feather name="map-pin" size={18} color="#2563EB" />}
        onPress={onNavigateToAddress}
      />
      <ProfileMenuItem
        label="Help & Support"
        icon={<Feather name="life-buoy" size={18} color="#7C3AED" />}
        onPress={onNavigateToHelp}
      />
      <ProfileMenuItem
        label="Settings"
        icon={<Feather name="settings" size={18} color="#0EA5E9" />}
        onPress={onNavigateToSettings}
      />
      <ProfileMenuItem
        label="Log out"
        icon={<Feather name="log-out" size={18} color="#DC2626" />}
        variant="danger"
        onPress={onLogout}
      />
    </View>
  );
}

