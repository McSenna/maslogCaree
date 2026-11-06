import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import { APPOINTMENT_METRICS } from "../appointmentTheme";

type Props = {
  palette: ResidentDialogPalette;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string | null;
  placeholder: string;
  hint: string;
  open: boolean;
  disabled?: boolean;
  loading?: boolean;
  hasError?: boolean;
  required?: boolean;
  onPress: () => void;
};

/**
 * A tappable box that shows the chosen value and opens its picker. Same height
 * and radius as the Service Type box, drawn from the dialog palette so it also
 * follows dark mode in the reschedule dialog. Long dates wrap instead of clipping.
 */
export const PickerField = ({ palette, label, icon, value, placeholder, hint, open, disabled = false, loading = false, hasError = false, required = false, onPress }: Props) => {
  const { hovered, focused, pressed, handlers } = useInteractionState({ disabled });
  const highlighted = open || hovered || pressed;
  const borderColor = hasError ? palette.danger : highlighted ? palette.accent : palette.border;

  return (
    <View className="min-w-[200px] flex-1 gap-1.5">
      <Text accessibilityElementsHidden importantForAccessibility="no" style={[TYPE.bodyStrong, { fontWeight: "700", color: palette.heading }]}>
        {label}
        {required ? <Text style={{ color: palette.danger }}> *</Text> : null}
      </Text>
      <Pressable
        {...handlers}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={required ? `${label}, required` : label}
        accessibilityHint={hint}
        accessibilityValue={{ text: value ?? placeholder }}
        accessibilityState={{ disabled, expanded: open }}
        className="w-full flex-row items-center gap-3 px-3 py-2"
        style={[
          {
            minHeight: APPOINTMENT_METRICS.fieldHeight,
            borderRadius: APPOINTMENT_METRICS.radiusField,
            borderWidth: hasError || open ? 1.5 : 1,
            borderColor,
            backgroundColor: disabled ? palette.card : palette.cardRaised,
            opacity: disabled ? 0.7 : 1,
          },
          focused ? focusRing(palette.accent) : null,
          webStyle({ cursor: disabled ? "not-allowed" : "pointer" }),
        ]}
      >
        <MaterialCommunityIcons name={icon} size={20} color={hasError ? palette.danger : palette.accent} />
        {loading ? <ActivityIndicator size="small" color={palette.accent} /> : null}
        <Text className="min-w-0 flex-1" style={[value ? TYPE.bodyStrong : TYPE.body, { color: value ? palette.heading : palette.muted }]}>
          {value ?? placeholder}
        </Text>
        <MaterialCommunityIcons name={open ? "chevron-up" : "chevron-down"} size={20} color={palette.muted} />
      </Pressable>
    </View>
  );
};

export default PickerField;
