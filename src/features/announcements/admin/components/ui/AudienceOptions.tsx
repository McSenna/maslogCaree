import { Check } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useReducedMotion } from "@/theme/motion";

import type { AudienceFilter } from "../../adminAnnouncement.types";
import { AUDIENCE_FILTERS, AUDIENCE_FILTER_LABELS } from "../../adminAnnouncementModel";
import { useAnnouncementTheme } from "../../useAnnouncementTheme";

export type MenuAnchor = { x: number; y: number; width: number };

const MENU_MIN_WIDTH = 176;

type AudienceOptionsProps = {
  anchor: MenuAnchor | null;
  wide?: boolean;
  value: AudienceFilter;
  onChoose: (value: AudienceFilter) => void;
  onClose: () => void;
};

const Option = ({ label, selected, wide, onPress }: {
  label: string;
  selected: boolean;
  wide?: boolean;
  onPress: () => void;
}) => {
  const { palette } = useAnnouncementTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      className={`${wide ? "min-h-10 px-3" : "min-h-12 px-4"} flex-row items-center justify-between gap-3 active:bg-neutral hover:bg-neutral web:cursor-pointer`}
    >
      <Text className={`${wide ? "text-14" : "text-15"} text-ink ${selected ? "font-ps-semibold" : "font-ps"}`}>{label}</Text>
      {selected ? <Check size={16} color={palette.brand} strokeWidth={2} /> : null}
    </Pressable>
  );
};

/**
 * The audience choices, as a menu under the field (wide) or a bottom sheet
 * (phone). A Modal either way, so Escape and Android back close it and focus
 * stays inside while it is open.
 */
const AudienceOptions = ({ anchor, wide, value, onChoose, onClose }: AudienceOptionsProps) => {
  const theme = useAnnouncementTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  const options = AUDIENCE_FILTERS.map((option) => (
    <Option
      key={option}
      label={AUDIENCE_FILTER_LABELS[option]}
      selected={option === value}
      wide={wide}
      onPress={() => onChoose(option)}
    />
  ));

  // Dynamic position and inset values only; everything static is a class. The
  // menu is wider than the field, so it lines up with the field's right edge.
  const menuWidth = anchor ? Math.max(anchor.width, MENU_MIN_WIDTH) : 0;
  const menuFrame = anchor
    ? { top: anchor.y, left: Math.max(8, anchor.x + anchor.width - menuWidth), width: menuWidth }
    : undefined;
  const sheetInset = { paddingBottom: Math.max(insets.bottom, 12) };

  return (
    <Modal
      visible={Boolean(anchor)}
      transparent
      animationType={reducedMotion ? "none" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={theme.vars} className={`flex-1 ${wide ? "" : "justify-end bg-scrim"}`}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close audience options"
          className="absolute inset-0"
        />
        {wide ? (
          <View style={menuFrame} accessibilityRole="radiogroup" className="absolute rounded-control border border-line bg-canvas py-1">
            {options}
          </View>
        ) : (
          <View style={sheetInset} className="rounded-t-control border-t border-line bg-canvas pt-2">
            <Text accessibilityRole="header" className="px-4 py-3 font-ps-semibold text-15 text-ink">
              Audience
            </Text>
            <View accessibilityRole="radiogroup">{options}</View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default AudienceOptions;
