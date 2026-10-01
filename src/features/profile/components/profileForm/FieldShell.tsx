import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

const FieldShell = ({ label, hint, error, children }: FieldShellProps) => {
  const colors = useThemeColors();

  return (
    <View style={{ gap: SPACING.xs }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", columnGap: SPACING.sm }}>
        <Text maxFontSizeMultiplier={1.3} style={{ ...TYPE.label, color: colors.heading }}>
          {label}
        </Text>
        {hint ? (
          <Text maxFontSizeMultiplier={1.3} style={{ ...TYPE.caption, color: colors.subtle }}>
            {hint}
          </Text>
        ) : null}
      </View>

      {children}

      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          maxFontSizeMultiplier={1.3}
          style={{ ...TYPE.caption, color: colors.danger.fg }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default FieldShell;
