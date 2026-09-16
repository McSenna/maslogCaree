import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DETAIL_RADIUS, useUserDetailsPalette } from "../../../details/detailsTheme";

const APPROVE_GREEN = "#16A34A";

type Props = {
  residentName?: string;
  approving: boolean;
  rejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
};

const VerificationSheetActions = ({
  residentName,
  approving,
  rejecting,
  onApprove,
  onReject,
}: Props) => {
  const palette = useUserDetailsPalette();
  const insets = useSafeAreaInsets();
  const busy = approving || rejecting;

  return (
    <View
      className="w-full gap-2.5 px-4 pt-3"
      style={{
        borderTopWidth: 1,
        borderTopColor: palette.divider,
        paddingBottom: Math.max(insets.bottom, 12) + 4,
      }}
    >
      <Pressable
        onPress={onApprove}
        disabled={busy}
        accessibilityRole="button"
        accessibilityState={{ disabled: busy }}
        accessibilityLabel={`Approve ${residentName ?? "this resident"}`}
        className="w-full flex-row items-center justify-center gap-2 active:opacity-85"
        style={{
          height: 52,
          borderRadius: DETAIL_RADIUS.control,
          backgroundColor: APPROVE_GREEN,
          opacity: busy ? 0.7 : 1,
        }}
      >
        {approving ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Feather name="check-circle" size={16} color="#FFFFFF" />
        )}
        <Text className="text-[14.5px] font-bold text-white">
          {approving ? "Approving…" : "Approve Resident"}
        </Text>
      </Pressable>

      <Pressable
        onPress={onReject}
        disabled={busy}
        accessibilityRole="button"
        accessibilityState={{ disabled: busy }}
        accessibilityLabel={`Reject the registration of ${residentName ?? "this resident"}`}
        className="w-full flex-row items-center justify-center gap-2 active:opacity-85"
        style={{
          height: 52,
          borderRadius: DETAIL_RADIUS.control,
          backgroundColor: palette.dangerBg,
          borderWidth: 1,
          borderColor: palette.dangerBorder,
          opacity: busy ? 0.7 : 1,
        }}
      >
        {rejecting ? (
          <ActivityIndicator size="small" color={palette.dangerText} />
        ) : (
          <Feather name="x-circle" size={16} color={palette.dangerText} />
        )}
        <Text className="text-[14.5px] font-bold" style={{ color: palette.dangerText }}>
          {rejecting ? "Rejecting…" : "Reject Request"}
        </Text>
      </Pressable>
    </View>
  );
};

export default VerificationSheetActions;
