import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { REGISTRATION_STEPS } from "../registrationOptions";
import { REG_COLORS } from "../registrationTheme";

type ProgressStepperProps = {
  currentIndex: number;
  completed: boolean[];
  onStepPress?: (index: number) => void;
  compact?: boolean;
};

const DOT = 26;

const ProgressStepper = ({
  currentIndex,
  completed,
  onStepPress,
  compact,
}: ProgressStepperProps) => (
  <View
    style={{ flexDirection: "row", width: "100%" }}
    accessibilityRole="progressbar"
    accessibilityLabel={`Step ${currentIndex + 1} of ${REGISTRATION_STEPS.length}: ${
      REGISTRATION_STEPS[currentIndex].label
    }`}
  >
    {REGISTRATION_STEPS.map((step, index) => {
      const isDone = completed[index];
      const isCurrent = index === currentIndex;
      const reachable = isDone && Boolean(onStepPress);

      const dotColor = isCurrent
        ? REG_COLORS.primary
        : isDone
          ? REG_COLORS.secondary
          : REG_COLORS.surface;

      return (
        <View key={step.key} style={{ flex: 1, alignItems: "center", gap: 6, minWidth: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
            <View
              style={{
                flex: 1,
                height: 2,
                backgroundColor:
                  index === 0
                    ? "transparent"
                    : isDone || isCurrent
                      ? REG_COLORS.primary
                      : REG_COLORS.border,
              }}
            />

            <Pressable
              disabled={!reachable}
              onPress={() => onStepPress?.(index)}
              accessibilityRole={reachable ? "button" : "text"}
              accessibilityLabel={`Step ${index + 1}, ${step.label}${
                isDone ? ", completed" : isCurrent ? ", current" : ""
              }`}
              hitSlop={8}
              style={{
                width: DOT,
                height: DOT,
                borderRadius: DOT / 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: dotColor,
                borderWidth: isCurrent || isDone ? 0 : 1,
                borderColor: REG_COLORS.border,
              }}
            >
              {isDone ? (
                <Feather name="check" size={14} color={REG_COLORS.surface} />
              ) : (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: isCurrent ? REG_COLORS.surface : REG_COLORS.subtle,
                  }}
                >
                  {index + 1}
                </Text>
              )}
            </Pressable>

            <View
              style={{
                flex: 1,
                height: 2,
                backgroundColor:
                  index === REGISTRATION_STEPS.length - 1
                    ? "transparent"
                    : isDone
                      ? REG_COLORS.primary
                      : REG_COLORS.border,
              }}
            />
          </View>

          <Text
            numberOfLines={1}
            style={{
              fontSize: compact ? 11.5 : 12.5,
              fontWeight: isCurrent ? "700" : "500",
              color: isCurrent
                ? REG_COLORS.primary
                : isDone
                  ? REG_COLORS.secondary
                  : REG_COLORS.subtle,
            }}
          >
            {step.label}
          </Text>
        </View>
      );
    })}
  </View>
);

export default ProgressStepper;
