import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import { useDebouncedValue } from "@/features/users/admin/hooks/useDebouncedValue";
import {
  clampPage,
  defaultView,
  hasListParams,
  parseView,
  toParams,
  totalPagesOf,
  withFilters,
  withLimit,
  type ListSchema,
  type ListView,
  type RawParams,
} from "@/lib/listState/listStateCodec";
import { getSavedSearch, getSavedView, saveSearch, saveView } from "@/lib/listState/viewStateStore";

const useIsomorphicLayoutEffect = Platform.OS === "web" ? useLayoutEffect : useEffect;

type Options<F extends Record<string, string>> = {
  /** One per list, e.g. "inventory"; names the saved view and search. */
  key: string;
  /** A module-level constant, so its identity never changes. */
  schema: ListSchema<F>;
  /** Items the server reported for the current query; null while unknown. */
  total?: number | null;
  /** False for lists that append pages (phone infinite scroll): restoring page 3 alone would hide pages 1 and 2. */
  persistPage?: boolean;
  searchDebounceMs?: number;
  /** A search handed over in memory (System Logs' "View activity"): opens a fresh view with it, ignoring any saved one. */
  initialSearch?: string;
};

/**
 * Page, page size, sort and filters for a paged list, kept in the route's query
 * string (`?page=3&status=active`) so a refresh, a reopened app or a shared link
 * lands on the same view. The route is the only source of truth; on Android and
 * iOS, a route without any of the list's values falls back to the last view
 * saved on the device. Search text stays out of the URL (it can hold a name).
 */
export const usePersistedPagination = <F extends Record<string, string>>({
  key,
  schema,
  total = null,
  persistPage = true,
  searchDebounceMs = 300,
  initialSearch = "",
}: Options<F>) => {
  const params: RawParams = useLocalSearchParams<Record<string, string | string[]>>();
  const router = useRouter();
  const [appendedPage, setAppendedPage] = useState(1);

  const source = hasListParams(schema, params) || initialSearch ? params : (getSavedView(key) ?? params);
  const restored = parseView(schema, source);
  const view: ListView<F> = persistPage ? restored : { ...restored, page: appendedPage };
  // Several updates in one event (clear search, then filters) must build on each other, not on the last render.
  const latest = useRef(view);
  useIsomorphicLayoutEffect(() => {
    latest.current = view;
  });

  const commit = useCallback(
    (next: ListView<F>) => {
      latest.current = next;
      if (!persistPage) setAppendedPage(next.page);
      const values = toParams(schema, next, { includePage: persistPage });
      // Replaces the current history entry: paging never floods the back button.
      router.setParams(values);
      saveView(key, values);
    },
    [key, persistPage, router, schema]
  );

  const totalPages = total === null ? null : totalPagesOf(total, view.limit);
  // A page past the end (a hand-edited link, or rows deleted from the last page) shows the new last page at once.
  const page = totalPages === null ? view.page : clampPage(view.page, totalPages);
  const isClamping = page !== view.page;

  useEffect(() => {
    // Moving onto the last page is the point of this effect.
    if (isClamping) commit({ ...latest.current, page });
  }, [commit, isClamping, page]);

  const [searchInput, setSearchInputValue] = useState(() => initialSearch || getSavedSearch(key));
  const [search, setSearch] = useState(() => (initialSearch || getSavedSearch(key)).trim());
  const searchRef = useRef(search);
  const settled = useDebouncedValue(searchInput.trim(), searchDebounceMs);

  // Only a settled change to the text counts; restoring the saved search on mount is not a change.
  useEffect(() => {
    if (settled === searchRef.current) return;
    searchRef.current = settled;
    // The settled text becomes the query.
    setSearch(settled);
    saveSearch(key, settled);
    commit({ ...latest.current, page: 1 });
  }, [commit, key, settled]);

  /** Sets the search at once (clear buttons, summary cards); a different search goes back to page 1. */
  const replaceSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      const changed = trimmed !== searchRef.current;
      searchRef.current = trimmed;
      setSearchInputValue(value);
      setSearch(trimmed);
      saveSearch(key, trimmed);
      if (changed) commit({ ...latest.current, page: 1 });
    },
    [commit, key]
  );

  const setPage = useCallback(
    (next: number) => {
      const whole = Math.max(1, Math.floor(Number.isFinite(next) ? next : 1));
      commit({ ...latest.current, page: totalPages === null ? whole : clampPage(whole, totalPages) });
    },
    [commit, totalPages]
  );

  const setFilters = useCallback((patch: Partial<F>) => commit(withFilters(latest.current, patch)), [commit]);
  const setLimit = useCallback((limit: number) => commit(withLimit(latest.current, limit)), [commit]);

  const reset = useCallback(() => {
    replaceSearch("");
    commit(defaultView(schema));
  }, [commit, replaceSearch, schema]);

  return {
    page,
    limit: view.limit,
    filters: view.filters,
    totalPages,
    isClamping,
    setPage,
    setLimit,
    setFilters,
    reset,
    searchInput,
    setSearchInput: setSearchInputValue,
    search,
    replaceSearch,
  };
};

export type PersistedPagination<F extends Record<string, string>> = ReturnType<typeof usePersistedPagination<F>>;
