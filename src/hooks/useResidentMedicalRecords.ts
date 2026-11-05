import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useFocusEffect } from "expo-router";

import { clearImmunizationSelection, getImmunizationSelection, subscribeImmunizationSelection } from "@/features/immunization/selection";
import { babyPreviewRecord, isBabyPreview, rowsForPage, totalWithBabies } from "@/features/medical-records/residentRecordRows";
import { useRemoteData } from "@/features/users/admin/hooks/useRemoteData";
import { SEARCH_DEBOUNCE_MS } from "@/features/users/admin/hooks/useUserFilterState";
import { useMedicalRecordViewer } from "@/hooks/useMedicalRecordViewer";
import { usePersistedPagination } from "@/hooks/usePersistedPagination";
import type { ListSchema } from "@/lib/listState/listStateCodec";
import { searchMyMedicalRecords, type MedicalRecord, type MyRecordsPage } from "@/services/medicalRecords";
import { toastError } from "@/utils/errorToast/toastError";

export const RESIDENT_RECORDS_PAGE_SIZE = 20;

const LIVE_SOURCES = ["myMedicalRecord"] as const;
const SCHEMA: ListSchema<{ service: string; range: string }> = {
  fields: {
    service: { kind: "code", param: "service" },
    range: { kind: "enum", values: ["", "6m", "12m"], fallback: "" },
  },
  limits: [RESIDENT_RECORDS_PAGE_SIZE],
};

type ListResult = MyRecordsPage & { filterKey: string };

/**
 * The signed-in resident's records, a page at a time. The server decides whose
 * records these are from the account's own link, so the request names nobody.
 */
export const useResidentMedicalRecords = () => {
  const [listTotal, setListTotal] = useState<number | null>(null);
  const list = usePersistedPagination({
    key: "resident-medical-records",
    schema: SCHEMA,
    total: listTotal,
    searchDebounceMs: SEARCH_DEBOUNCE_MS,
  });
  const { page, filters, search, searchInput, setFilters, setSearchInput, replaceSearch } = list;
  const viewer = useMedicalRecordViewer();
  const [preview, setPreview] = useState<MedicalRecord | null>(null);

  const filterKey = JSON.stringify({ ...filters, search });
  const query = { service: filters.service, range: filters.range, query: search, page };
  const result = useRemoteData<ListResult>({
    key: `resident-medical-records:${JSON.stringify(query)}`,
    load: async () => ({ ...(await searchMyMedicalRecords(query)), filterKey }),
    live: LIVE_SOURCES,
  });

  // Coming back to the screen picks up records filed while away, keeping the rows shown.
  const refetch = result.refetch;
  const focusedOnce = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (focusedOnce.current) refetch();
      focusedOnce.current = true;
    }, [refetch])
  );

  const current = result.data?.filterKey === filterKey ? result.data : null;
  const babies = current?.babiesWithoutRecords ?? [];
  const serverTotal = current?.total ?? 0;
  const settled = !result.isFetching && current !== null;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the server's count once a load settles
    if (settled) setListTotal(serverTotal);
  }, [settled, serverTotal]);
  const pastEnd = settled && serverTotal > 0 && page > Math.ceil(serverTotal / RESIDENT_RECORDS_PAGE_SIZE);

  const open = useCallback(
    (record: MedicalRecord) => {
      if (isBabyPreview(record)) setPreview(record);
      else void viewer.open(record);
    },
    [viewer.open] // eslint-disable-line react-hooks/exhaustive-deps -- viewer is a new object each render; open is stable
  );
  const closeViewer = viewer.close;
  const close = useCallback(() => {
    setPreview(null);
    closeViewer();
  }, [closeViewer]);

  // A notification tap, or a shortcut from a visit record, names a baby. Its record opens here.
  const selectedBaby = useSyncExternalStore(subscribeImmunizationSelection, getImmunizationSelection, () => null);
  const openById = viewer.openById;
  useEffect(() => {
    if (!selectedBaby) return;
    let active = true;
    const openBaby = async () => {
      try {
        const found = await searchMyMedicalRecords({ service: "", range: "", query: "", page: 1, babyId: selectedBaby });
        if (!active) return;
        const baby = found.babiesWithoutRecords.find((row) => row._id === selectedBaby);
        if (found.records[0]) openById(found.records[0]._id);
        else if (baby) setPreview(babyPreviewRecord(baby));
        else toastError("Unable to open this baby's record", new Error("This record is not available on your account."));
      } catch (caught: unknown) {
        if (active) toastError("Unable to open this baby's record", caught);
      } finally {
        if (active) clearImmunizationSelection();
      }
    };
    void openBaby();
    return () => {
      active = false;
    };
  }, [selectedBaby, openById]);

  const clearFilters = () => {
    replaceSearch("");
    setFilters({ service: "", range: "" });
  };

  return {
    filters,
    setFilters,
    search: searchInput,
    setSearch: setSearchInput,
    clearFilters,
    filtered: Boolean(searchInput || filters.service || filters.range),
    page,
    setPage: list.setPage,
    rows: rowsForPage(page, current?.records ?? [], babies, filters, search),
    total: totalWithBabies(serverTotal, babies, filters, search),
    isLoading: (!current && !result.error) || result.isLoading || pastEnd,
    isRefreshing: result.isFetching && !result.isLoading,
    error: result.error,
    refresh: refetch,
    open,
    close,
    detail: {
      isOpen: viewer.isOpen || preview !== null,
      record: preview ?? viewer.record,
      form: preview ? null : viewer.form,
      loading: preview ? false : viewer.loading,
      error: preview ? null : viewer.error,
      retry: viewer.retry,
    },
  };
};

export type ResidentMedicalRecordsState = ReturnType<typeof useResidentMedicalRecords>;
