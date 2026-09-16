import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { REG_COLORS, REG_RADIUS } from "../registrationTheme";

type RegistrationFooterProps = {
  onBack?: () => void;
  onNext: () => void;
  isFinalStep: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  height: number;
};

const RegistrationFooter = ({
  onBack,
  onNext,
  isFinalStep,
  isSubmitting,
  canSubmit,
  height,
}: RegistrationFooterProps) => {
  const disabled = isSubmitting || (isFinalStep && !canSubmit);
  const label = isFinalStep
    ? isSubmitting
      ? "Creating Account..."
      : "Create Account"
    : "Next";

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, width: "100%" }}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Go back to the previous step"
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            height,
            paddingHorizontal: 20,
            borderRadius: REG_RADIUS.control,
            borderWidth: 1,
            borderColor: REG_COLORS.border,
            backgroundColor: REG_COLORS.surface,
            opacity: isSubmitting ? 0.5 : 1,
          }}
        >
          <Feather name="arrow-left" size={16} color={REG_COLORS.muted} />
          <Text style={{ fontSize: 14.5, fontWeight: "600", color: REG_COLORS.muted }}>Back</Text>
        </Pressable>
      ) : null}

      <Pressable
        onPress={onNext}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, busy: isSubmitting }}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          height,
          borderRadius: REG_RADIUS.control,
          backgroundColor: disabled ? REG_COLORS.borderStrong : REG_COLORS.primary,
        }}
      >
        {isSubmitting ? <ActivityIndicator size="small" color={REG_COLORS.surface} /> : null}
        <Text style={{ fontSize: 15, fontWeight: "700", color: REG_COLORS.surface }}>{label}</Text>
        {!isSubmitting ? (
          <Feather
            name={isFinalStep ? "user-check" : "arrow-right"}
            size={17}
            color={REG_COLORS.surface}
          />
        ) : null}
      </Pressable>
    </View>
  );
};

export default RegistrationFooter;
