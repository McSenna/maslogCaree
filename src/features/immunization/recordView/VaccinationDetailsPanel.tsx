import { Fragment, useCallback, useRef } from "react";
import { AccessibilityInfo, findNodeHandle, Platform, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { TableEmptyState, TableErrorState } from "@/components/data-table";
import type { EmptyAction } from "@/components/data-table/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { RADII } from "@/theme/radius";
import { TYPE } from "@/theme/typography";

import type { VaccinationRecordState } from "./useVaccinationRecord";
import type { VaccinationTabsState } from "./useVaccinationTabs";
import { vaccinationEmptyCopy } from "./vaccinationEmptyCopy";
import VaccinationEntryCard from "./VaccinationEntryCard";
import type { VaccinationEntry } from "./vaccinationTypes";

type Props = {
  view: VaccinationRecordState;
  tabs: VaccinationTabsState;
  emptyAction?: EmptyAction;
  /** Editing only: opens a dose in the dose modal. */
  onOpenDose?: (doseKey: string) => void;
};

// Keeps the entry's top border clear of the pinned tabs.
const SCROLL_MARGIN = 8;

const moveFocusTo = (node: View | null) => {
  if (!node) return;
  if (Platform.OS === "web") {
    (node as unknown as { focus?: (options: { preventScroll: boolean }) => void }).focus?.({ preventScroll: true });
    return;
  }
  const handle = findNodeHandle(node);
  if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
};

/** Every saved dose in labeled groups, so a selected cell or row always has an entry to land on. */
const VaccinationDetailsPanel = ({ view, tabs, emptyAction, onOpenDose }: Props) => {
  const palette = useQueuePalette();
  const { targetEntryId, scrollTo } = tabs;
  const panelY = useRef<number | null>(null);
  const entryY = useRef<number | null>(null);
  const targetNode = useRef<View | null>(null);
  const landedOn = useRef<string | null>(null);

  // Layout events arrive in no fixed order, so either one may be the last piece needed.
  const land = useCallback(() => {
    if (!targetEntryId || landedOn.current === targetEntryId) return;
    if (panelY.current === null || entryY.current === null) return;
    landedOn.current = targetEntryId;
    scrollTo(Math.max(0, panelY.current + entryY.current - SCROLL_MARGIN));
    moveFocusTo(targetNode.current);
  }, [scrollTo, targetEntryId]);

  const onPanelLayout = (event: LayoutChangeEvent) => {
    panelY.current = event.nativeEvent.layout.y;
    land();
  };

  const renderEntry = (entry: VaccinationEntry) => {
    const targeted = entry.id === targetEntryId;
    return (
      <VaccinationEntryCard
        key={entry.id}
        ref={targeted ? targetNode : undefined}
        entry={entry}
        targeted={targeted}
        // A saved dose outside the schedule has no dose to edit, so it stays read-only.
        onOpen={onOpenDose && view.checklist?.doses.some((dose) => dose.key === entry.id) ? () => onOpenDose(entry.id) : undefined}
        onLayout={(event) => {
          if (!targeted) return;
          entryY.current = event.nativeEvent.layout.y;
          land();
        }}
      />
    );
  };

  if (view.loading) {
    return (
      <View style={styles.panel} accessibilityLabel="Loading vaccination details">
        <Skeleton style={styles.skeleton} />
        <Skeleton style={styles.skeleton} />
      </View>
    );
  }

  if (!view.entries.length) {
    const empty = vaccinationEmptyCopy(view);
    return (
      <View style={[styles.state, { backgroundColor: palette.panelBg, borderColor: palette.panelBorder }]}>
        {view.error ? (
          <TableErrorState title="Could not load the vaccination details." message={view.error} onRetry={view.retry} />
        ) : (
          <TableEmptyState icon={empty.icon} title={empty.title} description={empty.description} action={emptyAction} />
        )}
      </View>
    );
  }

  // Fragments add no view, so an entry's layout offset is still measured from the panel.
  return (
    <View style={styles.panel} onLayout={onPanelLayout}>
      {view.groups.map((group) => (
        <Fragment key={group.title}>
          <Text accessibilityRole="header" style={[styles.group, { color: palette.heading }]}>{group.title} ({group.entries.length})</Text>
          {group.entries.map(renderEntry)}
        </Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: { gap: 12 },
  skeleton: { height: 160, borderRadius: RADII.large },
  state: { borderWidth: 1, borderRadius: RADII.large },
  group: { ...TYPE.bodyStrong, fontWeight: "700" },
});

export default VaccinationDetailsPanel;
