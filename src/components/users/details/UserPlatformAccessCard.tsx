import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { describePlatformAccess } from "@/config/platformAccess";
import type { AdminUser } from "@/services/userService";
import DetailCard from "./DetailCard";
import { useUserDetailsPalette } from "./detailsTheme";

function AccessRow({
  icon,
  label,
  enabled,
  divided,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  enabled: boolean;
  divided: boolean;
}) {
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
      {/* Icon and wording both, so the state never rests on colour alone. */}
      <Feather name={tone.icon} size={17} color={tone.color} />
      <Text className="text-[13.5px] font-semibold" style={{ color: tone.color }}>
        {tone.value}
      </Text>
    </View>
  );
}

/**
 * Which clients this account may sign in from.
 *
 * Both platforms are always listed, including the one that is switched off:
 * "Mobile: Enabled" on its own leaves an admin guessing whether web was denied
 * or merely unmentioned, and that guess is what generates the support ticket
 * when a resident cannot reach the web app.
 *
 * The server sends the summary; the local policy table only fills in for a
 * payload written before the field existed. Neither is a permission check —
 * both describe a decision the login path has already made.
 */
export function PlatformAccessRows({ user }: { user: AdminUser }) {
  const access = user.platformAccess ?? describePlatformAccess(user.role);

  return (
    <>
      <AccessRow icon="globe" label="Web Access" enabled={access.web} divided />
      <AccessRow icon="smartphone" label="Mobile Access" enabled={access.mobile} divided={false} />
    </>
  );
}

export default function UserPlatformAccessCard({ user }: { user: AdminUser }) {
  return (
    <DetailCard icon="smartphone" title="Platform Access">
      <PlatformAccessRows user={user} />
    </DetailCard>
  );
}
