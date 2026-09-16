import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { PASSWORD_RULES, passwordStrength } from "../passwordRules";
import { RECOVERY_COLORS as C } from "../recoveryTheme";

const STRENGTH_META = {
  weak: { label: "Weak", color: C.error, fill: 1 },
  medium: { label: "Medium", color: "#D97706", fill: 2 },
  strong: { label: "Strong", color: C.success, fill: 3 },
} as const;

export const PasswordStrengthMeter = ({ value }: { value: string }) => {
  const meta = STRENGTH_META[passwordStrength(value)];

  return (
    <View className="w-full gap-1.5" accessibilityLabel={`Password strength: ${meta.label}`}>
      <View className="flex-row gap-1.5">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: value && i < meta.fill ? meta.color : C.border }}
          />
        ))}
      </View>
      {value ? (
        <Text className="text-[11.5px] font-semibold" style={{ color: meta.color }}>
          {meta.label} password
        </Text>
      ) : null}
    </View>
  );
};

const PasswordRequirements = ({ value }: { value: string }) => (
  <View className="w-full gap-1.5">
    {PASSWORD_RULES.map((rule) => {
      const passed = rule.test(value);
      return (
        <View
          key={rule.key}
          className="flex-row items-center gap-2"
          accessibilityRole="text"
          accessibilityLabel={`${rule.label}: ${passed ? "met" : "not met"}`}
        >
          <Feather
            name={passed ? "check-circle" : "circle"}
            size={13}
            color={passed ? C.success : C.border}
          />
          <Text
            className="text-[12px]"
            style={{ color: passed ? C.success : C.muted, fontWeight: passed ? "600" : "400" }}
          >
            {rule.label}
          </Text>
        </View>
      );
    })}
  </View>
);

export default PasswordRequirements;
