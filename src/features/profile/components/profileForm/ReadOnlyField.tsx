import { Text } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { TYPE } from "@/theme/typography";
import FieldShell from "./FieldShell";

type ReadOnlyFieldProps = {
  label: string;
  value: string;
  hint?: string;
};

const ReadOnlyField = ({ label, value, hint }: ReadOnlyFieldProps) => {
  const colors = useThemeColors();

  return (
    <FieldShell label={label} hint={hint}>
      <Text
        accessibilityLabel={`${label}: ${value}`}
        maxFontSizeMultiplier={1.3}
        style={{ ...TYPE.bodyStrong, color: colors.heading }}
      >
        {value}
      </Text>
    </FieldShell>
  );
};

export default ReadOnlyField;
