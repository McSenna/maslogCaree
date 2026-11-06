import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type FieldMessageProps = {
  nativeID?: string;
  error?: string | null;
  helper?: string;
  /** A short count at the end of the row, such as "12 / 800". */
  counter?: string;
};

const FieldMessage = ({ nativeID, error, helper, counter }: FieldMessageProps) => {
  const colors = useThemeColors();
  if (counter) {
    return (
      <View className="flex-row items-start gap-3">
        <View className="min-w-0 flex-1">
          <FieldMessage nativeID={nativeID} error={error} helper={helper} />
        </View>
        <Text style={{ fontSize: 14.5, lineHeight: 19, color: colors.muted, fontVariant: ["tabular-nums"] }}>{counter}</Text>
      </View>
    );
  }
  if (!error && !helper) return null;

  return (
    <View
      nativeID={nativeID}
      accessibilityLiveRegion={error ? "polite" : "none"}
      style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}
    >
      {error ? <Feather name="alert-circle" size={13} color={colors.danger.fg} style={{ marginTop: 2 }} /> : null}
      <Text style={{ flex: 1, fontSize: 14.5, lineHeight: 19, color: error ? colors.danger.fg : colors.muted }}>
        {error || helper}
      </Text>
    </View>
  );
};

export default FieldMessage;
