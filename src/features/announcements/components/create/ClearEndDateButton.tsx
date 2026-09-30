import { Pressable, Text } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";

const ClearEndDateButton = ({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) => {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      hitSlop={8}
      className="min-h-11 justify-center self-start web:cursor-pointer"
    >
      {({ pressed }) => (
        <Text className={`text-[14px] font-semibold ${pressed ? "underline" : ""}`} style={{ color: colors.primary }}>
          Remove end date
        </Text>
      )}
    </Pressable>
  );
};

export default ClearEndDateButton;
