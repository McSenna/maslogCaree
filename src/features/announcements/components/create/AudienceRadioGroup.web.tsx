import { useId, useState, type CSSProperties } from "react";
import { Text, View } from "react-native";

import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { RADII } from "@/theme/radius";
import { TYPE } from "@/theme/typography";

import { ANNOUNCEMENT_AUDIENCES, type Audience } from "../../announcement.types";
import { AUDIENCE_LEGEND, type AudienceRadioGroupProps } from "./audienceRadioGroup.types";

const FIELDSET_STYLE: CSSProperties = { border: 0, margin: 0, padding: 0, minWidth: 0 };
const LEGEND_STYLE: CSSProperties = { padding: 0, marginBottom: 4 };

/**
 * The browser's own fieldset and radios: arrow keys, Space and the screen
 * reader's "1 of 3" all work without help. Equal widths keep the bold selected
 * label from pushing its neighbours along.
 */
const AudienceRadioGroup = ({ value, onChange, disabled = false }: AudienceRadioGroupProps) => {
  const palette = useResidentDialogPalette();
  const name = useId();
  const [hovered, setHovered] = useState<Audience | null>(null);

  return (
    <fieldset disabled={disabled} style={FIELDSET_STYLE}>
      <legend style={LEGEND_STYLE}>
        <Text style={[TYPE.label, { color: palette.heading }]}>
          {AUDIENCE_LEGEND}
          <Text style={{ color: palette.dangerFg }}> *</Text>
        </Text>
      </legend>
      <View className="flex-row flex-wrap gap-1">
        {ANNOUNCEMENT_AUDIENCES.map((option) => {
          const selected = value === option;
          const rowStyle: CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: "1 1 104px",
            minHeight: 44,
            paddingInline: 8,
            borderRadius: RADII.small,
            cursor: disabled ? "not-allowed" : "pointer",
            backgroundColor: hovered === option && !disabled ? palette.accentSoft : "transparent",
            transition: "background-color 150ms ease",
          };
          return (
            <label key={option} style={rowStyle} onPointerEnter={() => setHovered(option)} onPointerLeave={() => setHovered(null)}>
              <input
                type="radio"
                name={name}
                checked={selected}
                onChange={() => onChange(option)}
                style={{ width: 18, height: 18, margin: 0, flexShrink: 0, cursor: "inherit", accentColor: palette.accent, outlineColor: palette.accent, outlineOffset: 2, colorScheme: palette.isDark ? "dark" : "light" }}
              />
              <Text style={[TYPE.body, { color: palette.heading, fontWeight: selected ? "700" : "400" }]}>{option}</Text>
            </label>
          );
        })}
      </View>
    </fieldset>
  );
};

export default AudienceRadioGroup;
