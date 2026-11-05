import { Pressable, Text, View } from "react-native";

import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";

import { ANNOUNCEMENT_AUDIENCES } from "../../announcement.types";
import { AUDIENCE_LEGEND, type AudienceRadioGroupProps } from "./audienceRadioGroup.types";

const AudienceRadioGroup = ({ value, onChange, disabled = false }: AudienceRadioGroupProps) => {
  const palette = useResidentDialogPalette();

  return (
    <View className="gap-1" accessibilityRole="radiogroup" accessibilityLabel={AUDIENCE_LEGEND}>
      <Text style={[TYPE.label, { color: palette.heading }]}>
        {AUDIENCE_LEGEND}
        <Text style={{ color: palette.dangerFg }}> *</Text>
      </Text>
      <View className="flex-row flex-wrap gap-1">
        {ANNOUNCEMENT_AUDIENCES.map((option) => {
          const selected = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityLabel={option}
              accessibilityState={{ checked: selected, disabled }}
              className="min-h-11 grow basis-24 flex-row items-center gap-2 px-2 active:opacity-70"
            >
              <View
                className="h-5 w-5 items-center justify-center rounded-full border-2"
                style={{ borderColor: selected ? palette.accent : palette.muted }}
              >
                {selected ? <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette.accent }} /> : null}
              </View>
              <Text style={[TYPE.body, { color: palette.heading, fontWeight: selected ? "700" : "400" }]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default AudienceRadioGroup;
