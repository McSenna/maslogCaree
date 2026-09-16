import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { RECOVERY_COLORS as C } from "../recoveryTheme";

const FlowHeader = ({
  canGoBack,
  dismissible,
  onBack,
  onClose,
}: {
  canGoBack: boolean;
  dismissible: boolean;
  onBack: () => void;
  onClose: () => void;
}) => (
  <View className="w-full flex-row items-center justify-between">
    {canGoBack ? (
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back to the previous step"
        hitSlop={12}
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: C.background }}
      >
        <Feather name="arrow-left" size={17} color={C.muted} />
      </Pressable>
    ) : (
      <View className="h-9 w-9" />
    )}

    <Text className="text-[11px] font-bold uppercase" style={{ color: C.muted, letterSpacing: 1 }}>
      Account Recovery
    </Text>

    <Pressable
      onPress={onClose}
      disabled={!dismissible}
      accessibilityRole="button"
      accessibilityLabel="Close account recovery"
      hitSlop={12}
      className="h-9 w-9 items-center justify-center rounded-full"
      style={{ backgroundColor: C.background, opacity: dismissible ? 1 : 0.4 }}
    >
      <Feather name="x" size={17} color={C.muted} />
    </Pressable>
  </View>
);

export default FlowHeader;
