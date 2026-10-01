import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import { resolveFieldAppearance } from "@/components/forms/fieldAppearance";
import DateOfBirthPicker from "@/features/auth/components/datePicker/DateOfBirthPicker";
import { formatBirthDate } from "@/features/auth/utils/dateOfBirth";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webTransition } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";
import FieldShell from "./FieldShell";

type DateOfBirthFieldProps = {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  error?: string;
};

const FIELD_WEB = webStyle({ cursor: "pointer", transition: webTransition("border-color") });

const DateOfBirthField = ({ label, value, onChange, error }: DateOfBirthFieldProps) => {
  const colors = useThemeColors();
  const [open, setOpen] = useState(false);
  const { hovered, focused, handlers } = useInteractionState();
  const look = resolveFieldAppearance(colors, {
    focused,
    hovered,
    error: Boolean(error),
    success: false,
    disabled: false,
  });
  const display = value ? formatBirthDate(value) : "Select date of birth";

  return (
    <FieldShell label={label} error={error}>
      <Pressable
        {...handlers}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: display }}
        accessibilityHint="Opens a date picker"
        onPress={() => setOpen(true)}
        style={{
          minHeight: 46,
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
          paddingHorizontal: SPACING.md,
          borderRadius: RADII.medium,
          borderWidth: look.borderWidth,
          borderColor: look.border,
          backgroundColor: look.background,
          outlineWidth: focused ? 3 : 0,
          outlineColor: colors.focusRing,
          outlineStyle: "solid",
          ...FIELD_WEB,
        }}
      >
        <Feather name="calendar" size={16} color={look.icon} />
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
          style={{ ...TYPE.body, flex: 1, color: value ? colors.heading : colors.subtle }}
        >
          {display}
        </Text>
        <Feather name="chevron-down" size={16} color={colors.muted} />
      </Pressable>

      <DateOfBirthPicker
        visible={open}
        value={value}
        onConfirm={onChange}
        onClose={() => setOpen(false)}
      />
    </FieldShell>
  );
};

export default DateOfBirthField;
