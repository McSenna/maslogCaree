import { useEffect, useRef, useState } from "react";

import { useDebouncedValue } from "@/features/users/admin/hooks/useDebouncedValue";
import { SEARCH_DEBOUNCE_MS } from "@/features/users/admin/hooks/useUserFilterState";
import { normalizeApiError } from "@/utils/apiErrorHandler";

import { searchResidentIdentities } from "../services/masterlistRecordsApi";
import type { ResidentIdentity } from "../types";

// Two letters is the least that can narrow a barangay's list usefully.
const MIN_QUERY = 2;

/** Debounced master list lookup for the resident step. The newest search wins. */
export const useIdentitySearch = () => {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);
  const [results, setResults] = useState<ResidentIdentity[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sequence = useRef(0);

  useEffect(() => {
    const id = ++sequence.current;
    if (debounced.length < MIN_QUERY) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing results when the query is too short
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchResidentIdentities(debounced)
      .then((found) => {
        if (id !== sequence.current) return;
        setResults(found);
        setError(null);
      })
      .catch((caught: unknown) => {
        if (id === sequence.current) setError(normalizeApiError(caught).message);
      })
      .finally(() => {
        if (id === sequence.current) setSearching(false);
      });
  }, [debounced]);

  return {
    query,
    setQuery,
    results,
    searching: searching || (query.trim().length >= MIN_QUERY && query.trim() !== debounced),
    error,
    tooShort: query.trim().length < MIN_QUERY,
  };
};
