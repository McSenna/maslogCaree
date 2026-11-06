import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { PALETTE, withAlpha } from "@/theme/palette";
import { TYPE } from "@/theme/typography";

type Props = {
  palette: ResidentDialogPalette;
  visible: boolean;
  title: string;
  subtitle?: string | null;
  desktopWidth: number;
  onClose: () => void;
  children: ReactNode;
};

const CloseButton = ({ palette, title, onPress }: { palette: ResidentDialogPalette; title: string; onPress: () => void }) => {
  const { hovered, focused, handlers } = useInteractionState();
  return (
    <Pressable
      {...handlers}
      accessibilityRole="button"
      accessibilityLabel={`Close ${title.toLowerCase()}`}
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-lg"
      style={[{ backgroundColor: hovered ? palette.accentSoft : palette.card }, focused ? focusRing(palette.accent) : null]}
    >
      <Feather name="x" size={18} color={palette.body} />
    </Pressable>
  );
};

/**
 * The date or time picker, opened from its box: a bottom sheet on phones and a
 * centred dialog from tablet width up. BottomSheet owns focus, Escape, Android
 * back and the scroll lock; this only adds the title row and scrolling body.
 */
export const PickerSheet = ({ palette, visible, title, subtitle = null, desktopWidth, onClose, children }: Props) => (
  <BottomSheet
    visible={visible}
    onClose={onClose}
    accessibilityLabel={title}
    surface={palette.surface}
    handleColor={palette.disabled}
    scrim={withAlpha(PALETTE.ink, 0.4)}
    maxHeightRatio={0.85}
    desktopWidth={desktopWidth}
    header={(requestClose) => (
      <View className="flex-row items-center gap-3 border-b px-4 pb-3 pt-2" style={{ borderColor: palette.divider }}>
        <View className="min-w-0 flex-1">
          <Text accessibilityRole="header" style={[TYPE.title, { color: palette.heading }]}>
            {title}
          </Text>
          {subtitle ? <Text style={[TYPE.caption, { color: palette.body }]}>{subtitle}</Text> : null}
        </View>
        <CloseButton palette={palette} title={title} onPress={requestClose} />
      </View>
    )}
  >
    <ScrollView style={SHEET_SCROLL_STYLE} contentContainerClassName="p-4" bounces={false} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  </BottomSheet>
);

export default PickerSheet;
