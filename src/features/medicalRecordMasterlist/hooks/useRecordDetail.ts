import { useCallback, useState } from "react";

import { useRealtimeItem } from "@/hooks/realtime/useRealtimeItem";
import { normalizeApiError, type NormalizedApiError } from "@/utils/apiErrorHandler";

import { fetchMasterlistRecord } from "../services/masterlistRecordsApi";
import type { MasterlistDetail } from "../types";

const LOAD_FAILED = "Unable to load this medical record. Try again.";
const NOT_ALLOWED = "You do not have permission to access this medical record.";

// A 403 here is "not your service", not "gone": it must read as a permission message.
const isGone = (error: NormalizedApiError) => error.status === 404;

/**
 * Loads one record's detail only when it is opened; closing drops it so no
 * stale record shows next time. While open, another staff member's edit
 * reloads it (the detail carries more than the pushed list row).
 */
export const useRecordDetail = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [preview, setPreview] = useState<MasterlistDetail | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async (id: string) => {
    try {
      const detail = await fetchMasterlistRecord(id);
      setForbidden(false);
      return detail;
    } catch (caught: unknown) {
      setForbidden(normalizeApiError(caught).status === 403);
      throw caught;
    }
  }, []);

  const { item, loading, error, deleted, reload } = useRealtimeItem("medicalRecord", openId, load, {
    errorMessage: LOAD_FAILED,
    isGone,
  });

  const open = useCallback((id: string) => {
    setPreview(null);
    setForbidden(false);
    setOpenId(id);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    setPreview(null);
  }, []);

  /** Shows a record the caller already holds (just saved), then keeps it current. */
  const show = useCallback((detail: MasterlistDetail) => {
    setPreview(detail);
    setOpenId(detail._id);
  }, []);

  const detail = item ?? (preview?._id === openId ? preview : null);
  const failure = deleted ? "This medical record is no longer available." : error;

  return {
    isOpen: openId !== null,
    detail,
    loading: loading && detail === null,
    error: detail || loading ? null : failure && (forbidden ? NOT_ALLOWED : failure),
    open,
    close,
    retry: reload,
    show,
  };
};

export type RecordDetailState = ReturnType<typeof useRecordDetail>;
