import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

export type PasswordStrengthLevel = "weak" | "medium" | "strong";

const LEVELS: Record<PasswordStrengthLevel, { label: string; fill: number }> = {
  weak: { label: "Weak", fill: 1 },
  medium: { label: "Medium", fill: 2 },
  strong: { label: "Strong", fill: 3 },
};

const PasswordStrengthMeter = ({ strength }: { strength: PasswordStrengthLevel }) => {
  const colors = useThemeColors();
  const level = LEVELS[strength];
  const color =
    strength === "strong" ? colors.success.fg : strength === "medium" ? colors.warning.fg : colors.danger.fg;

  return (
    <View
      accessible
      accessibilityLabel={`Password strength: ${level.label}`}
      style={{ gap: 4, marginTop: -2 }}
    >
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={{ height: 4, flex: 1, borderRadius: 2, backgroundColor: index < level.fill ? color : colors.border }}
          />
        ))}
      </View>
      <Text style={{ fontSize: 12, fontWeight: "600", color }}>{level.label} password</Text>
    </View>
  );
};

export default PasswordStrengthMeter;
