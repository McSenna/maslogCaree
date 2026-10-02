import {
  fetchSignupRequests,
  fetchUserSummary,
  fetchUsersPage,
  type Page,
  type SignupRequestParams,
  type UsersPage,
} from "../services/userAdminApi";
import type { SignupRequest, UserListParams } from "../userAdmin.types";
import { useRemoteData } from "./useRemoteData";

export const PAGE_SIZE = 20;

const EMPTY_PAGE: UsersPage = { items: [], records: [], total: 0 };

export const useUserSummary = () => {
  const { data, isLoading, error, refetch } = useRemoteData({ key: "summary", load: fetchUserSummary });
  return { data, isLoading, error, refetch };
};

const appendPage = (previous: UsersPage | null, next: UsersPage): UsersPage => {
  if (!previous) return next;
  const seen = new Set(previous.items.map((user) => user.id));
  return {
    items: [...previous.items, ...next.items.filter((user) => !seen.has(user.id))],
    records: [...previous.records, ...next.records.filter((record) => !seen.has(record._id))],
    total: next.total,
  };
};

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
  const result = useRemoteData({ key, load, merge });

  return {
    items: result.data?.items ?? [],
    records: result.data?.records ?? [],
    total: result.data?.total ?? 0,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isRefreshing: result.isRefreshing,
    error: result.error,
    refetch: result.refetch,
  };
};

const appendRequests = (previous: Page<SignupRequest> | null, next: Page<SignupRequest>): Page<SignupRequest> => {
  if (!previous) return next;
  const seen = new Set(previous.items.map((request) => request.id));
  return { items: [...previous.items, ...next.items.filter((request) => !seen.has(request.id))], total: next.total };
};

export const useSignupRequests = (params: SignupRequestParams & { enabled: boolean; append?: boolean }) => {
  const { enabled, append = false, ...query } = params;
  const key = enabled ? JSON.stringify(query) : "off";
  const load = () => (enabled ? fetchSignupRequests(query) : Promise.resolve({ items: [], total: 0 }));
  const merge = append && query.page > 1 ? appendRequests : undefined;
  const result = useRemoteData({ key, load, merge });

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
