import api from "@/services/api";
import type { ResidentWebAccess } from "@/features/webAccess/accessTypes";

import type { AdminUser } from "../../services/userService";
import type { ApiUser, ApiUserSummary, Role, StatusAction, User, UserListParams, UserSummary, WebOverride } from "../userAdmin.types";
import { roleToApi, segmentOf, statusParamOf, toSummary, toUsers } from "../userAdminModel";

export type Page<T> = { items: T[]; total: number };
export type UsersPage = Page<User>;

const listParams = (params: Omit<UserListParams, "page" | "pageSize">) => ({
  segment: segmentOf(params.tab),
  search: params.query || undefined,
  role: params.role === "all" ? undefined : roleToApi(params.role),
  status: statusParamOf(params.status),
  sort: params.sort,
});

export const fetchUsersPage = async (params: UserListParams): Promise<UsersPage> => {
  const { data } = await api.get<{ users: ApiUser[]; pagination: { total: number } }>("/users", {
    params: { ...listParams(params), page: params.page, per_page: params.pageSize },
  });
  return { items: toUsers(data.users ?? []), total: data.pagination?.total ?? 0 };
};

export const fetchUserSummary = async (): Promise<UserSummary> => {
  const { data } = await api.get<{ summary: ApiUserSummary }>("/users/summary");
  return toSummary(data.summary);
};

export const fetchUserDetail = async (id: string): Promise<AdminUser> => {
  const { data } = await api.get<{ user: AdminUser }>(`/users/${id}`);
  return data.user;
};

export const setUserStatus = async (id: string, action: StatusAction, rejection?: { reason: string; remarks?: string }): Promise<void> => {
  await api.patch(`/users/${id}/status`, { action, ...rejection });
};

export type UserEdit = { fullname?: string; phone?: string; address?: string };

/** Returns the new version, which a role change saved straight after needs. */
export const updateUser = async (id: string, edit: UserEdit, updatedAt: string | null): Promise<string | null> => {
  const { data } = await api.patch<{ user: ApiUser }>(`/users/${id}`, { ...edit, updatedAt });
  return data.user.updatedAt;
};

export const changeUserRole = async (id: string, role: Role, updatedAt: string | null): Promise<void> => {
  await api.patch(`/users/${id}/role`, { role: roleToApi(role), updatedAt });
};

export const sendPasswordReset = async (id: string): Promise<string> => {
  const { data } = await api.post<{ message: string }>(`/users/${id}/password-reset`, {});
  return data.message;
};

export type WebAccessSaved = { changed: boolean; access: ResidentWebAccess & { status: "on" | "off" } };

/** The answer is what the app reports, so a toast never claims more than the server did. */
export const setWebOverride = async (id: string, override: WebOverride, revision: number, reason = ""): Promise<WebAccessSaved> => {
  const { data } = await api.patch<WebAccessSaved>(`/admin/users/${id}/web-access`, { override, revision, reason: reason.trim() || null });
  return data;
};

export const exportUsers = async (params: Omit<UserListParams, "page" | "pageSize">): Promise<{ csv: string; truncated: boolean }> => {
  const response = await api.get<string>("/users/export", { params: listParams(params), responseType: "text" });
  return { csv: response.data, truncated: response.headers["x-export-truncated"] === "true" };
};
