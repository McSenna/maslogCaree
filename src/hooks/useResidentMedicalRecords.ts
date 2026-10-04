import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import type { FilterState } from "@/components/medicalRecord/history/MedicalRecordFilters";
import { useDebouncedValue } from "@/features/users/admin/hooks/useDebouncedValue";
import { useRealtimeEvents, useResyncSignal } from "@/hooks/realtime/useRealtimeEvents";
import { useMedicalRecordViewer } from "@/hooks/useMedicalRecordViewer";
import { searchMyMedicalRecords, type MedicalRecord, type MyRecordsCursor } from "@/services/medicalRecords";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export const INITIAL_RECORD_FILTERS: FilterState = { query: "", service: "all", range: "any" };

/**
 * The resident's history, a page at a time, filtered on the server so a long
 * history never loads in one request. Completed visits and records from the
 * health center's files come back together, newest first.
 */
export const useResidentMedicalRecords = () => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_RECORD_FILTERS);
  const query = useDebouncedValue(filters.query.trim(), 300);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState<MyRecordsCursor | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viewer = useMedicalRecordViewer();
  const sequence = useRef(0);
  // The filters the shown list was loaded with: a change shows the skeleton, a refocus does not.
  const loadedKey = useRef<string | null>(null);
  const criteria = { service: filters.service, range: filters.range, query };
  const criteriaKey = JSON.stringify(criteria);

  const loadFirst = useCallback(
    async (showSpinner: boolean) => {
      const id = ++sequence.current;
      if (showSpinner) setLoading(true);
      try {
        const page = await searchMyMedicalRecords({ service: criteria.service, range: criteria.range, query: criteria.query });
        if (id !== sequence.current) return;
        setRecords(page.records);
        setTotal(page.total ?? page.records.length);
        setCursor(page.nextCursor);
        setError(null);
        loadedKey.current = JSON.stringify({ service: criteria.service, range: criteria.range, query: criteria.query });
      } catch (caught: unknown) {
        if (id === sequence.current) setError(getApiErrorMessage(caught, "Unable to load your medical records."));
      } finally {
        if (id === sequence.current) setLoading(false);
      }
    },
    [criteria.service, criteria.range, criteria.query]
  );

  // Runs on first focus, on every return to the screen (picking up new records)
  // and whenever the filters change, since the callback changes with them.
  useFocusEffect(
    useCallback(() => {
      void loadFirst(loadedKey.current !== criteriaKey);
    }, [loadFirst, criteriaKey])
  );

  // A health worker's edit to a record already on screen is swapped in place, so
  // the resident keeps their place in a long history. A new record, or one that
  // may now fall inside or outside the filters, reloads the first page instead.
  useRealtimeEvents("myMedicalRecord", (change) => {
    if (change.action === "deleted") {
      setRecords((current) => current.filter((record) => record._id !== change.id));
      return;
    }
    if (change.action === "updated" && records.some((record) => record._id === change.record._id)) {
      setRecords((current) => current.map((record) => (record._id === change.record._id ? change.record : record)));
      return;
    }
    void loadFirst(false);
  });
  useResyncSignal(() => void loadFirst(false));

  const loadMore = async () => {
    if (!cursor || loadingMore || loading) return;
    const id = sequence.current;
    setLoadingMore(true);
    try {
      const page = await searchMyMedicalRecords({ ...criteria, before: cursor });
      if (id !== sequence.current) return;
      setRecords((current) => [...current, ...page.records.filter((record) => !current.some((seen) => seen._id === record._id))]);
      setCursor(page.nextCursor);
    } catch (caught: unknown) {
      if (id === sequence.current) setError(getApiErrorMessage(caught, "Unable to load more records."));
    } finally {
      setLoadingMore(false);
    }
  };

  const filtered = filters.query.trim() !== "" || filters.service !== "all" || filters.range !== "any";

  return {
    records,
    total,
    filters,
    setFilters,
    filtered,
    loading,
    loadingMore,
    hasMore: cursor !== null,
    error,
    refetch: () => void loadFirst(true),
    loadMore: () => void loadMore(),
    viewer,
  };
};
