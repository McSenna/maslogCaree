import { Text, View } from "react-native";
import type { RecoveryStep } from "../useForgotPassword";
import { RECOVERY_COLORS as C } from "../recoveryTheme";

const STAGES: { key: RecoveryStep[]; label: string }[] = [
  { key: ["email", "sent"], label: "Email" },
  { key: ["otp"], label: "Verification" },
  { key: ["password"], label: "New Password" },
  { key: ["success"], label: "Done" },
];

const stageIndex = (step: RecoveryStep) => STAGES.findIndex((s) => s.key.includes(step));

const StepIndicator = ({ step, compact }: { step: RecoveryStep; compact?: boolean }) => {
  const current = stageIndex(step);

  if (compact) {
    return (
      <View
        className="w-full flex-row items-center justify-center gap-1.5"
        accessibilityLabel={`Step ${current + 1} of ${STAGES.length}`}
      >
        {STAGES.map((stage, index) => (
          <View
            key={stage.label}
            className="h-1.5 rounded-full"
            style={{
              width: index === current ? 18 : 6,
              backgroundColor: index <= current ? C.primary : C.border,
            }}
          />
        ))}
      </View>
    );
  }

  return (
    <View
      className="w-full flex-row items-center"
      accessibilityLabel={`Step ${current + 1} of ${STAGES.length}: ${STAGES[current]?.label}`}
    >
      {STAGES.map((stage, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <View key={stage.label} className="min-w-0 flex-1 items-center gap-1.5">
            <View className="w-full flex-row items-center">
              <View
                className="h-0.5 flex-1"
                style={{ backgroundColor: index === 0 ? "transparent" : done || active ? C.primary : C.border }}
              />
              <View
                className="h-6 w-6 items-center justify-center rounded-full"
                style={{
                  backgroundColor: done || active ? C.primary : C.surface,
                  borderWidth: done || active ? 0 : 1,
                  borderColor: C.border,
                }}
              >
                <Text
                  className="text-[11px] font-bold"
                  style={{ color: done || active ? "#FFFFFF" : C.muted }}
                >
                  {index + 1}
                </Text>
              </View>
              <View
                className="h-0.5 flex-1"
                style={{
                  backgroundColor:
                    index === STAGES.length - 1 ? "transparent" : done ? C.primary : C.border,
                }}
              />
            </View>
            <Text
              className="text-[10.5px] font-semibold"
              numberOfLines={1}
              style={{ color: active ? C.primary : C.muted }}
            >
              {stage.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default StepIndicator;
