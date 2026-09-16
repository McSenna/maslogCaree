import type { ReactNode } from "react";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { REG_COLORS } from "../registrationTheme";

type FieldShellProps = {
  label: string;
  required?: boolean;
  optional?: boolean;
  helper?: string;
  error?: string;
  children: ReactNode;
  nativeID?: string;
};

const FieldShell = ({
  label,
  required,
  optional,
  helper,
  error,
  children,
  nativeID,
}: FieldShellProps) => (
  <View style={{ width: "100%", gap: 6 }}>
    <Text
      style={{
        fontSize: 13,
        fontWeight: "600",
        color: REG_COLORS.heading,
        letterSpacing: 0.1,
      }}
    >
      {label}
      {required ? <Text style={{ color: REG_COLORS.error }}> *</Text> : null}
      {optional ? (
        <Text style={{ color: REG_COLORS.subtle, fontWeight: "500" }}> (Optional)</Text>
      ) : null}
    </Text>

    {children}

    {error ? (
      <View
        style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}
        nativeID={nativeID}
        accessibilityRole="alert"
      >
        <Feather
          name="alert-circle"
          size={13}
          color={REG_COLORS.error}
          style={{ marginTop: 1 }}
        />
        <Text style={{ flex: 1, fontSize: 12.5, lineHeight: 17, color: REG_COLORS.error }}>
          {error}
        </Text>
      </View>
    ) : helper ? (
      <Text style={{ fontSize: 12.5, lineHeight: 17, color: REG_COLORS.muted }}>
        {helper}
      </Text>
    ) : null}
  </View>
);

export default FieldShell;
