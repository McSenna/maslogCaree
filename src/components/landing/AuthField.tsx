import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AuthInput from "./AuthInput";
import { AUTH_INPUT_COLORS } from "./authInput/authInputStyles";

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

type AuthFieldProps = {
  label: string;
  helperText?: string;
  error?: string | null;
  labelSize?: number;
  labelGap?: number;
} & Omit<React.ComponentProps<typeof AuthInput>, "hasError" | "accessibilityHint">;

const AuthField = ({
  label,
  helperText,
  error,
  labelSize = 13,
  labelGap = 7,
  ...inputProps
}: AuthFieldProps) => {
  const hasError = Boolean(error);

  return (
    <View>
      <Text
        style={[
          styles.label,
          { fontSize: labelSize, lineHeight: Math.round(labelSize * 1.3), marginBottom: labelGap },
          hasError && styles.labelError,
        ]}
      >
        {label}
      </Text>

      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}

      <AuthInput
        {...inputProps}
        accessibilityLabel={inputProps.accessibilityLabel || label}
        accessibilityHint={error ?? undefined}
        hasError={hasError}
      />

      {hasError ? (
        <View style={styles.errorRow} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={13} color={AUTH_INPUT_COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    color: AUTH_INPUT_COLORS.label,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.1,
  },
  labelError: {
    color: AUTH_INPUT_COLORS.error,
  },
  helper: {
    fontSize: 12,
    lineHeight: 16,
    color: "#64748B",
    fontFamily: FONT_FAMILY,
    marginBottom: 6,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: AUTH_INPUT_COLORS.error,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
  },
});

export default AuthField;
