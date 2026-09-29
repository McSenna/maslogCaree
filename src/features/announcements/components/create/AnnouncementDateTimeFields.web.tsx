import { useId, useMemo, useState, type CSSProperties } from "react";
import { View } from "react-native";

import { resolveFieldAppearance } from "@/components/forms/fieldAppearance";
import { useTheme } from "@/contexts/ThemeContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { TIMING } from "@/theme/motion";
import { RADII } from "@/theme/radius";

import { announcementDateRange, parseClock } from "../../announcementRules";
import { formatClockLabel, formatDateKeyLabel } from "../../announcementFormat";
import PickerFieldShell from "./PickerFieldShell";
import type { AnnouncementDateTimeFieldsProps } from "./dateTimeFields.types";

type NativeInputProps = {
  id: string;
  type: "date" | "time";
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
};

/**
 * The browser's own date and time inputs: keyboard-editable, screen-reader
 * labelled, and backed by the platform picker.
 */
const NativeInput = ({ id, type, label, value, onChange, error, helper, disabled, min, max }: NativeInputProps) => {
  const colors = useThemeColors();
  const { resolvedTheme } = useTheme();
  const messageId = `${id}-message`;
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const look = resolveFieldAppearance(colors, {
    focused,
    hovered,
    error: Boolean(error),
    success: false,
    disabled: Boolean(disabled),
  });

  const style: CSSProperties = {
    boxSizing: "border-box",
    width: "100%",
    height: 46,
    padding: "0 14px",
    borderRadius: RADII.medium,
    borderStyle: "solid",
    borderWidth: look.borderWidth,
    borderColor: look.border,
    backgroundColor: look.background,
    color: value ? colors.heading : colors.subtle,
    colorScheme: resolvedTheme === "dark" ? "dark" : "light",
    font: "inherit",
    fontSize: 15,
    outline: "none",
    boxShadow: look.ring ? `0 0 0 3px ${look.ring}` : "none",
    transition: `border-color ${TIMING.hover}ms ease, box-shadow ${TIMING.hover}ms ease`,
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  return (
    <PickerFieldShell label={label} messageId={messageId} error={error} helper={helper} required>
      <input
        id={id}
        type={type}
        value={value}
        min={min}
        max={max}
        step={type === "time" ? 60 : undefined}
        required
        disabled={disabled}
        aria-label={label}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error || helper ? messageId : undefined}
        onChange={(event) => onChange(event.currentTarget.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={style}
      />
    </PickerFieldShell>
  );
};

const AnnouncementDateTimeFields = ({
  date,
  time,
  onChangeDate,
  onChangeTime,
  dateError,
  timeError,
  disabled,
  stacked = false,
}: AnnouncementDateTimeFieldsProps) => {
  const baseId = useId();
  const range = useMemo(() => announcementDateRange(), []);

  return (
    <View style={stacked ? { gap: 16 } : { flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
      <View style={stacked ? undefined : { flex: 1.4, minWidth: 0 }}>
        <NativeInput
          id={`${baseId}-date`}
          type="date"
          label="Date"
          value={date}
          onChange={onChangeDate}
          error={dateError}
          helper={formatDateKeyLabel(date) || undefined}
          disabled={disabled}
          min={range.min}
          max={range.max}
        />
      </View>
      <View style={stacked ? undefined : { flex: 1, minWidth: 0 }}>
        <NativeInput
          id={`${baseId}-time`}
          type="time"
          label="Time"
          value={time}
          onChange={onChangeTime}
          error={timeError}
          helper={parseClock(time) === null ? undefined : formatClockLabel(time)}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default AnnouncementDateTimeFields;
