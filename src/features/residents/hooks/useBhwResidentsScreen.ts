import { useCallback, useMemo, useState } from "react";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import {
  DENSE_WINDOW_WIDTH,
  RESIDENTS_LAYOUT,
} from "../components/residentsLayout";
import { useResidents } from "./useResidents";

export const useBhwResidentsScreen = () => {
  const insets = useRoleScreenInsets();
  const residents = useResidents();

  const [contentWidth, setContentWidth] = useState(insets.width);
  const [tableAreaWidth, setTableAreaWidth] = useState(0);
  const [detailsResidentId, setDetailsResidentId] = useState<string | null>(null);

  const detailsResident = useMemo(
    () => residents.residents.find((resident) => resident._id === detailsResidentId) ?? null,
    [residents.residents, detailsResidentId]
  );

  const detailsError =
    detailsResidentId !== null && !detailsResident && !residents.busy
      ? residents.error ?? "This resident is no longer in the directory."
      : null;

  const measureContent = useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      const next = Math.round(event.nativeEvent.layout.width);
      if (next > 0) setContentWidth((current) => (next === current ? current : next));
    },
    []
  );

  return {
    insets,
    residents,

    detailsResidentId,
    detailsResident,
    detailsError,
    openDetails: setDetailsResidentId,
    closeDetails: useCallback(() => setDetailsResidentId(null), []),

    tableAreaWidth,
    setTableAreaWidth,
    measureContent,

    showTable: contentWidth >= RESIDENTS_LAYOUT.table,
    wideSummary: contentWidth >= RESIDENTS_LAYOUT.wideSummary,
    dense: insets.width < DENSE_WINDOW_WIDTH,
    contentPadding: {
      paddingHorizontal: insets.gutter,
      paddingTop: insets.paddingTop,
      paddingBottom: insets.paddingBottom,
    },
  };
};

export type BhwResidentsController = ReturnType<typeof useBhwResidentsScreen>;
