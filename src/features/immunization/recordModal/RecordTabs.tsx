import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import { useInteractionState } from "@/hooks/useInteractionState";
import { webTransition } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";

import useRecordModalStyles from "./recordModalStyles";
import { nextTab } from "./recordModel";
import type { RecordTab } from "./types";

const TAB_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "color") });
const ICON_SIZE = 18;

export const RECORD_TABS: readonly { key: RecordTab; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: "vaccinations", label: "Vaccinations", icon: "edit-2" },
  { key: "visit", label: "Visit details", icon: "calendar" },
  { key: "notes", label: "Clinical notes", icon: "file-text" },
  { key: "history", label: "History", icon: "clock" },
];

export const tabIdOf = (baseId: string, tab: RecordTab) => `${baseId}-tab-${tab}`;
export const panelIdOf = (baseId: string, tab: RecordTab) => `${baseId}-panel-${tab}`;

type FocusableTab = { focus?: () => void };

type RecordTabProps = {
  tab: (typeof RECORD_TABS)[number];
  baseId: string;
  selected: boolean;
  onSelect: () => void;
  onKey: (key: string) => boolean;
  register: (node: FocusableTab | null) => void;
};

const RecordTabButton = ({ tab, baseId, selected, onSelect, onKey, register }: RecordTabProps) => {
  const { colors, styles } = useRecordModalStyles();
  const { hovered, focused, handlers } = useInteractionState();
  const keyboard =
    Platform.OS === "web"
      ? {
          "aria-controls": panelIdOf(baseId, tab.key),
          onKeyDown: (event: { key: string; preventDefault: () => void }) => {
            if (onKey(event.key)) event.preventDefault();
          },
        }
      : {};
  return (
    <Pressable
      {...handlers}
      {...keyboard}
      ref={register as never}
      nativeID={tabIdOf(baseId, tab.key)}
      onPress={onSelect}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      aria-selected={selected}
      accessibilityLabel={tab.label}
      tabIndex={selected ? 0 : -1}
      style={[
        styles.tab,
        selected && styles.tabActive,
        hovered && !selected && styles.tabHover,
        focused ? focusRing(colors.focusRing, -2) : null,
        TAB_WEB,
      ]}
    >
      <Feather name={tab.icon} size={ICON_SIZE} color={selected ? colors.primary : colors.body} />
      <Text style={[styles.tabText, selected && styles.tabTextActive]}>{tab.label}</Text>
    </Pressable>
  );
};

type RecordTabsProps = {
  baseId: string;
  active: RecordTab;
  onChange: (tab: RecordTab) => void;
};

/** Tabs that wrap on small screens, so none is ever scrolled out of sight. */
const RecordTabs = ({ baseId, active, onChange }: RecordTabsProps) => {
  const { styles } = useRecordModalStyles();
  const nodes = useRef(new Map<RecordTab, FocusableTab>());
  const moveWith = (key: string) => {
    const target = nextTab(active, key);
    if (!target) return false;
    onChange(target);
    nodes.current.get(target)?.focus?.();
    return true;
  };
  return (
    <View accessibilityRole="tablist" accessibilityLabel="Immunization record sections" style={styles.tabs}>
      {RECORD_TABS.map((tab) => (
        <RecordTabButton
          key={tab.key}
          tab={tab}
          baseId={baseId}
          selected={tab.key === active}
          onSelect={() => onChange(tab.key)}
          onKey={moveWith}
          register={(node) => {
            if (node) nodes.current.set(tab.key, node);
            else nodes.current.delete(tab.key);
          }}
        />
      ))}
    </View>
  );
};

export default RecordTabs;
