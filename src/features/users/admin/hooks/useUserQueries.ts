import { fetchUserSummary, fetchUsersPage, type UsersPage } from "../services/userAdminApi";
import type { UserListParams } from "../userAdmin.types";
import { replaceKnown } from "@/lib/realtime/collectionReducer";

import { useRemoteData } from "./useRemoteData";

export const PAGE_SIZE = 20;

const SUMMARY_SOURCES = ["user", "userRequest", "masterResident"] as const;
// A decision in the ID review changes the account row too.
const USER_SOURCES = ["user", "userRequest"] as const;

const EMPTY_PAGE: UsersPage = { items: [], total: 0 };

export const useUserSummary = () => {
  const { data, isLoading, error, refetch } = useRemoteData({ key: "summary", load: fetchUserSummary, live: SUMMARY_SOURCES });
  return { data, isLoading, error, refetch };
};

const appendPage = (previous: UsersPage | null, next: UsersPage): UsersPage => {
  if (!previous) return next;
  const seen = new Set(previous.items.map((user) => user.id));
  return {
    items: [...previous.items, ...next.items.filter((user) => !seen.has(user.id))],
    total: next.total,
  };
};

/** A quiet realtime reload of a deeper page: swap in updated rows, keep the rest. */
const refreshUsersPage = (previous: UsersPage | null, next: UsersPage): UsersPage =>
  previous
    ? {
        items: replaceKnown(previous.items, next.items, (user) => user.id),
        total: next.total,
      }
    : next;

/**
 * One server-filtered, server-sorted page of users. With `append` (phone
 * infinite scroll), pages after the first are added to the rows already loaded.
 */
export const useUsers = (params: UserListParams & { append?: boolean; enabled?: boolean }) => {
  const { append = false, enabled = true, ...query } = params;
  const key = enabled ? JSON.stringify(query) : "off";
  const merge = append && query.page > 1 ? appendPage : undefined;
  // useRemoteData reads the newest `load`, so a fresh closure each render is fine.
  const load = () => (enabled ? fetchUsersPage(query) : Promise.resolve(EMPTY_PAGE));
  const result = useRemoteData({ key, load, merge, live: enabled ? USER_SOURCES : undefined, liveMerge: refreshUsersPage });

  return {
    items: result.data?.items ?? [],
    total: result.data?.total ?? 0,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isRefreshing: result.isRefreshing,
    error: result.error,
    refetch: result.refetch,
  };
};
