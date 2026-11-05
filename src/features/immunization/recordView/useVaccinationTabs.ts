import { useCallback, useId, useState } from "react";
import { Platform } from "react-native";

import { useSyncOnChange } from "@/hooks/useSyncOnChange";

export type VaccinationTab = "overview" | "details";

const AT_TOP = { key: 0, y: 0 };

/** Six table columns need more than the default record dialog gives on a desktop window. */
export const VACCINATION_DIALOG_WIDTH = 1040;

/**
 * Lives with the dialog rather than its body: the tab bar sits in the shell's
 * pinned slot, and the shell owns the scroll position a "View Details" moves.
 */
export const useVaccinationTabs = (recordId: string | null) => {
  const baseId = useId();
  const [tab, setTab] = useState<VaccinationTab>("overview");
  const [targetEntryId, setTargetEntryId] = useState<string | null>(null);
  const [scroll, setScroll] = useState(AT_TOP);

  // Another record, or a closed dialog, starts again on Overview.
  useSyncOnChange([recordId], () => {
    setTab("overview");
    setTargetEntryId(null);
    setScroll(AT_TOP);
  });

  const scrollTo = useCallback((y: number) => setScroll((current) => ({ key: current.key + 1, y })), []);

  const select = useCallback(
    (next: VaccinationTab) => {
      if (next === tab) return;
      setTab(next);
      setTargetEntryId(null);
      scrollTo(0);
    },
    [scrollTo, tab]
  );

  const viewEntry = useCallback((entryId: string) => {
    setTab("details");
    setTargetEntryId(entryId);
  }, []);

  return { baseId, tab, targetEntryId, scroll, select, viewEntry, scrollTo };
};

export type VaccinationTabsState = ReturnType<typeof useVaccinationTabs>;
export const tabIdOf = (baseId: string, tab: VaccinationTab) => `${baseId}-tab-${tab}`;
export const panelIdOf = (baseId: string, tab: VaccinationTab) => `${baseId}-panel-${tab}`;
export const panelPropsOf = (baseId: string, tab: VaccinationTab) =>
  Platform.OS === "web"
    ? { nativeID: panelIdOf(baseId, tab), role: "tabpanel" as const, "aria-labelledby": tabIdOf(baseId, tab) }
    : {};
