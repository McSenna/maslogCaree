import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { describePlatformAccess } from "@/config/platformAccess";
import type { AdminUser } from "@/features/users/services/userService";
import DetailCard from "./DetailCard";
import { useUserDetailsPalette } from "./detailsTheme";

const AccessRow = ({
  icon,
  label,
  enabled,
  divided,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  enabled: boolean;
  divided: boolean;
}) => {
  const palette = useUserDetailsPalette();
  const tone = enabled
    ? { color: palette.enabled, icon: "check-circle" as const, value: "Enabled" }
    : { color: palette.disabled, icon: "x-circle" as const, value: "Disabled" };

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${tone.value}`}
      className="flex-row items-center gap-3 py-3.5"
      style={divided ? { borderBottomWidth: 1, borderBottomColor: palette.divider } : undefined}
    >
      <Feather name={icon} size={17} color={palette.subtle} />
      <Text className="min-w-0 flex-1 text-[13.5px]" style={{ color: palette.body }}>
        {label}
      </Text>
      <Feather name={tone.icon} size={17} color={tone.color} />
      <Text className="text-[13.5px] font-semibold" style={{ color: tone.color }}>
        {tone.value}
      </Text>
    </View>
  );
};

export const PlatformAccessRows = ({ user }: { user: AdminUser }) => {
  const access = user.platformAccess ?? describePlatformAccess(user.role);

  return (
    <>
      <AccessRow icon="globe" label="Web Access" enabled={access.web} divided />
      <AccessRow icon="smartphone" label="Mobile Access" enabled={access.mobile} divided={false} />
    </>
  );
};

const UserPlatformAccessCard = ({ user }: { user: AdminUser }) => {
  return (
    <DetailCard icon="smartphone" title="Platform Access">
      <PlatformAccessRows user={user} />
    </DetailCard>
  );
};

export default UserPlatformAccessCard;
