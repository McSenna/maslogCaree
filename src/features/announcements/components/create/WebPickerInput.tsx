import { useState, type CSSProperties } from "react";

import { resolveFieldAppearance } from "@/components/forms/fieldAppearance";
import { useTheme } from "@/contexts/ThemeContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { TIMING } from "@/theme/motion";
import { RADII } from "@/theme/radius";

import PickerFieldShell from "./PickerFieldShell";

// Web only: imported from the .web.tsx date fields, never from native code.
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
  required?: boolean;
};

/**
 * The browser's own date and time inputs: keyboard-editable, screen-reader
 * labelled, and backed by the platform picker.
 */
const NativeInput = ({
  id,
  type,
  label,
  value,
  onChange,
  error,
  helper,
  disabled,
  min,
  max,
  required = true,
}: NativeInputProps) => {
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
    <PickerFieldShell label={label} messageId={messageId} error={error} helper={helper} required={required}>
      <input
        id={id}
        type={type}
        value={value}
        min={min}
        max={max}
        step={type === "time" ? 60 : undefined}
        required={required}
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

export default NativeInput;
