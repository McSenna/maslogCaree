import type { Href } from "expo-router";

export type UserRole = "admin" | "doctor" | "midwife" | "bhw" | "resident";

const ROLE_ROUTES = {
  admin: { dashboard: "/admin/dashboard", profile: "/admin/profile", notifications: "/admin/notifications" },
  doctor: { dashboard: "/doctor/dashboard", profile: "/doctor/profile", notifications: "/doctor/notifications" },
  midwife: { dashboard: "/midwife/dashboard", profile: "/midwife/profile", notifications: "/midwife/notifications" },
  bhw: { dashboard: "/bhw/dashboard", profile: "/bhw/profile", notifications: "/bhw/notifications" },
  resident: { dashboard: "/resident/dashboard", profile: "/resident/profile", notifications: "/resident/notifications" },
} as const satisfies Record<UserRole, Record<"dashboard" | "profile" | "notifications", Href>>;

export const getDashboardPath = (role: UserRole) => ROLE_ROUTES[role].dashboard;

export const getProfilePath = (role: UserRole) => ROLE_ROUTES[role].profile;

export const getNotificationsPath = (role: UserRole) => ROLE_ROUTES[role].notifications;
