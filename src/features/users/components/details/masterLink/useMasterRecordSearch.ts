import { useEffect, useRef, useState } from "react";

import { useDebouncedValue } from "@/features/users/admin/hooks/useDebouncedValue";
import { SEARCH_DEBOUNCE_MS } from "@/features/users/admin/hooks/useUserFilterState";
import type { MasterResidentRecord } from "@/features/masterList/masterList.types";
import { fetchMasterResidents } from "@/features/masterList/services/masterListApi";
import { normalizeApiError } from "@/utils/apiErrorHandler";

/** Active master list records an account could be linked to (records another account holds are left out). */
export const useMasterRecordSearch = () => {
  const [query, setQuery] = useState("");
  const search = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);
  const [records, setRecords] = useState<MasterResidentRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sequence = useRef(0);

  useEffect(() => {
    const id = ++sequence.current;
    if (search.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing results when the query is too short
      setRecords([]);
      return;
    }
    setLoading(true);
    fetchMasterResidents({ search, status: "active", page: 1, limit: 8 })
      .then((page) => {
        if (id !== sequence.current) return;
        setRecords(page.records.filter((record) => !record.linkedAccount));
        setError(null);
      })
      .catch((caught: unknown) => {
        if (id === sequence.current) setError(normalizeApiError(caught).message);
      })
      .finally(() => {
        if (id === sequence.current) setLoading(false);
      });
  }, [search]);

  return { query, setQuery, records, error, loading, tooShort: search.length < 2 };
};
