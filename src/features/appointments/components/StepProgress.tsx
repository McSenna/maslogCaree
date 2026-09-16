import { Text, View } from "react-native";
import { APPOINTMENT_COLORS } from "./appointmentTheme";

const StepProgress = ({
  step,
  totalSteps = 2,
}: {
  step: number;
  totalSteps?: number;
}) => {
  const ratio = Math.min(Math.max(step / totalSteps, 0), 1);

  return (
    <View className="flex-row items-center" style={{ gap: 12 }}>
      <Text style={{ fontSize: 14, fontWeight: "700", color: APPOINTMENT_COLORS.primary }}>
        Step {step} of {totalSteps}
      </Text>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: totalSteps, now: step }}
        accessibilityLabel={`Step ${step} of ${totalSteps}`}
        className="min-w-0 flex-1"
        style={{
          height: 9,
          borderRadius: 999,
          backgroundColor: APPOINTMENT_COLORS.track,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            borderRadius: 999,
            backgroundColor: APPOINTMENT_COLORS.primaryBright,
          }}
        />
      </View>
    </View>
  );
};

export default StepProgress;
