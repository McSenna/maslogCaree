import { Pressable, Text } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { PALETTE } from "@/theme/palette";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

type Props = {
  palette: ResidentDialogPalette;
  label: string;
  accessibilityLabel?: string;
  selected: boolean;
  onPress: () => void;
};

const WEB = webStyle({ cursor: "pointer", transition: "background-color 150ms ease-out, border-color 150ms ease-out" });

/** One pickable start time. A radio in its group, so the chosen one is announced as checked. */
export const TimeChip = ({ palette, label, accessibilityLabel, selected, onPress }: Props) => {
  const { hovered, focused, pressed, handlers } = useInteractionState();
  const background = selected ? palette.accent : hovered || pressed ? palette.accentSoft : palette.card;

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      aria-checked={selected}
      accessibilityLabel={accessibilityLabel ?? label}
      className="min-h-11 justify-center rounded-lg border px-3"
      style={[
        {
          backgroundColor: background,
          borderColor: selected || hovered ? palette.accent : palette.border,
          opacity: pressed && !selected ? 0.85 : 1,
        },
        focused ? focusRing(palette.accent) : null,
        WEB,
      ]}
    >
      <Text style={[TYPE.label, { fontWeight: selected ? "700" : "500", color: selected ? PALETTE.white : palette.body }]}>
        {label}
      </Text>
    </Pressable>
  );
};

export default TimeChip;
