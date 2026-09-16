import { Text, View } from "react-native";
import { RADIUS, useUsersPalette } from "../usersTheme";
import type { UserRequestSummary } from "../../services/userRequestsService";

export type VerificationStatus = UserRequestSummary["verificationStatus"];

const RequestStatusBadge = ({
  status,
  compact = false,
}: {
  status: VerificationStatus;
  compact?: boolean;
}) => {
  const palette = useUsersPalette();
  const tone = palette.statuses[status] ?? palette.statuses.pending;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Verification status: ${tone.label}`}
      className={`flex-row items-center self-start ${
        compact ? "gap-1.5 px-2 py-1" : "gap-1.5 px-2.5 py-1.5"
      }`}
      style={{ backgroundColor: tone.bg, borderRadius: RADIUS.pill }}
    >
      <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone.dot }} />
      <Text
        className={compact ? "text-[11px] font-semibold" : "text-[12px] font-semibold"}
        style={{ color: tone.text }}
      >
        {tone.label}
      </Text>
    </View>
  );
};

export default RequestStatusBadge;
