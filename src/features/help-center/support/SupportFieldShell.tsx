import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { useResidentDialogPalette } from "@/design/residentDialogTheme";

type SupportFieldShellProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
};

const SupportFieldShell = ({
  label,
  required = false,
  hint,
  error,
  children,
}: SupportFieldShellProps) => {
  const palette = useResidentDialogPalette();

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: palette.heading }}>{label}</Text>
        {required ? <Text style={{ fontSize: 13, color: palette.danger }}>*</Text> : null}
      </View>

      {children}

      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={{ fontSize: 12, color: palette.dangerFg }}
        >
          {error}
        </Text>
      ) : hint ? (
        <Text style={{ fontSize: 12, color: palette.muted }}>{hint}</Text>
      ) : null}
    </View>
  );
};

export default SupportFieldShell;
