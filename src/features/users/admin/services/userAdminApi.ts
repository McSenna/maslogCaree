import api from "@/services/api";

import { getUserRequests } from "../../services/userRequestsService";
import type { AdminUser } from "../../services/userService";
import type {
  ApiSignupRequest,
  ApiUserSummary,
  Role,
  SignupRequest,
  StatusAction,
  User,
  UserListParams,
  UserSummary,
} from "../userAdmin.types";
import { roleToApi, toSignupRequest, toSummary, toUsers } from "../userAdminModel";

export type Page<T> = { items: T[]; total: number };

type UsersPageResponse = {
  users: AdminUser[];
  pagination: { total: number };
};

/** `records` keeps the full accounts for the profile panel, which shows more than the table. */
export type UsersPage = Page<User> & { records: AdminUser[] };

export const fetchUsersPage = async (params: UserListParams): Promise<UsersPage> => {
  const { data } = await api.get<UsersPageResponse>("/users", {
    params: {
      tab: params.tab,
      query: params.query || undefined,
      role: params.role === "all" ? undefined : roleToApi(params.role),
      status: params.status === "all" ? undefined : params.status,
      sort: params.sort,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  const records = data.users ?? [];
  return { items: toUsers(records), records, total: data.pagination?.total ?? 0 };
};

export const fetchUserSummary = async (): Promise<UserSummary> => {
  const { data } = await api.get<{ summary: ApiUserSummary }>("/users/summary");
  return toSummary(data.summary);
};

export type SignupRequestParams = { status: "pending" | "rejected"; query: string; page: number; pageSize: number };

export const fetchSignupRequests = async (params: SignupRequestParams): Promise<Page<SignupRequest>> => {
  const result = await getUserRequests({
    status: params.status,
    search: params.query || undefined,
    page: params.page,
    limit: params.pageSize,
  });
  // The request list types its rows more loosely than the fields read here.
  const rows: ApiSignupRequest[] = result.requests;
  return { items: rows.map(toSignupRequest), total: result.pagination.total };
};

/** Returns the ids the server changed; already-changed accounts and the admin's own are skipped. */
const setUsersStatus = async (ids: readonly string[], action: StatusAction): Promise<string[]> => {
  const { data } = await api.patch<{ updatedIds: string[] }>("/users/status", { ids, action });
  return data.updatedIds ?? [];
};

export const deactivateUsers = (ids: readonly string[]) => setUsersStatus(ids, "deactivate");
export const reactivateUsers = (ids: readonly string[]) => setUsersStatus(ids, "reactivate");

// NOTE: the backend has no role-change or admin password-reset endpoint yet.
// Both touch roles and sign-in, so they wait for the rules to be agreed; the
// menu shows them disabled until then.
export const changeRole = async (_ids: readonly string[], _role: Role): Promise<never> => {
  throw new Error("TODO: connect changeRole");
};

export const resetPassword = async (_id: string): Promise<never> => {
  throw new Error("TODO: connect resetPassword");
};

export const ROLE_CHANGE_AVAILABLE = false;
export const PASSWORD_RESET_AVAILABLE = false;
