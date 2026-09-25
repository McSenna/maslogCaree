import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type FieldMessageProps = {
  nativeID?: string;
  error?: string | null;
  helper?: string;
};

const FieldMessage = ({ nativeID, error, helper }: FieldMessageProps) => {
  const colors = useThemeColors();
  if (!error && !helper) return null;

  return (
    <View
      nativeID={nativeID}
      accessibilityLiveRegion={error ? "polite" : "none"}
      style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}
    >
      {error ? <Feather name="alert-circle" size={13} color={colors.danger.fg} style={{ marginTop: 2 }} /> : null}
      <Text style={{ flex: 1, fontSize: 12.5, lineHeight: 17, color: error ? colors.danger.fg : colors.muted }}>
        {error || helper}
      </Text>
    </View>
  );
};

export default FieldMessage;
