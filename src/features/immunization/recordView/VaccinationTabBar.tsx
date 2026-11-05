import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useResponsive } from "@/hooks/useResponsive";
import { webTransition } from "@/theme/motion";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import { panelIdOf, tabIdOf, type VaccinationTab, type VaccinationTabsState } from "./useVaccinationTabs";

type TabSpec = { key: VaccinationTab; label: string; icon: keyof typeof Feather.glyphMap };
type Focusable = { focus?: () => void };

const TABS: readonly TabSpec[] = [
  { key: "overview", label: "Overview", icon: "user" },
  { key: "details", label: "Vaccination Details", icon: "shield" },
];

const TAB_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "color") });

type TabProps = {
  spec: TabSpec;
  baseId: string;
  selected: boolean;
  onSelect: () => void;
  onKey: (key: string) => boolean;
  register: (node: Focusable | null) => void;
};

const TabButton = ({ spec, baseId, selected, onSelect, onKey, register }: TabProps) => {
  const palette = useAdminSurfacePalette();
  const { hovered, focused, handlers } = useInteractionState();
  const { isMobile } = useResponsive();
  const color = selected ? palette.primary : palette.body;
  const web =
    Platform.OS === "web"
      ? {
          "aria-controls": panelIdOf(baseId, spec.key),
          onKeyDown: (event: { key: string; preventDefault: () => void }) => {
            if (onKey(event.key)) event.preventDefault();
          },
        }
      : {};
  return (
    <Pressable
      {...handlers}
      {...web}
      ref={register as never}
      nativeID={tabIdOf(baseId, spec.key)}
      onPress={onSelect}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      aria-selected={selected}
      accessibilityLabel={spec.label}
      tabIndex={selected ? 0 : -1}
      style={[
        styles.tab,
        { borderBottomColor: selected ? palette.primary : "transparent" },
        hovered && !selected ? { backgroundColor: palette.hoverBg } : null,
        focused ? focusRing(palette.focusRing, -2) : null,
        TAB_WEB,
      ]}
    >
      {/* Left off on phones, so both labels fit whole at 320px and with larger system text. */}
      {isMobile ? null : <Feather name={spec.icon} size={16} color={color} />}
      <Text style={[styles.label, selected ? styles.labelActive : null, { color }]}>
        {spec.label}
      </Text>
    </Pressable>
  );
};

/** Pinned above the scrolling body, so the way back stays in reach after a jump to one dose. */
const VaccinationTabBar = ({ tabs }: { tabs: VaccinationTabsState }) => {
  const palette = useAdminSurfacePalette();
  const nodes = useRef(new Map<VaccinationTab, Focusable>());
  const onKey = (key: string) => {
    const index = TABS.findIndex((spec) => spec.key === tabs.tab);
    const last = TABS.length - 1;
    const target =
      key === "ArrowRight" ? TABS[index === last ? 0 : index + 1]
      : key === "ArrowLeft" ? TABS[index === 0 ? last : index - 1]
      : key === "Home" ? TABS[0]
      : key === "End" ? TABS[last]
      : null;
    if (!target) return false;
    tabs.select(target.key);
    nodes.current.get(target.key)?.focus?.();
    return true;
  };
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Immunization record sections"
      style={[styles.bar, { backgroundColor: palette.cardBg, borderBottomColor: palette.divider }]}
    >
      {TABS.map((spec) => (
        <TabButton
          key={spec.key}
          spec={spec}
          baseId={tabs.baseId}
          selected={spec.key === tabs.tab}
          onSelect={() => tabs.select(spec.key)}
          onKey={onKey}
          register={(node) => {
            if (node) nodes.current.set(spec.key, node);
            else nodes.current.delete(spec.key);
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { flexDirection: "row", paddingHorizontal: 12, borderBottomWidth: 1 },
  tab: {
    minHeight: 48,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: -1,
    borderBottomWidth: 2,
  },
  label: { ...TYPE.body, fontWeight: "500", flexShrink: 1 },
  labelActive: { fontWeight: "600" },
});

export default VaccinationTabBar;
