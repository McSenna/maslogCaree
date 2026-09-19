import { ACCOUNT_CATEGORY } from "./categories/account.category";
import { APPOINTMENTS_CATEGORY } from "./categories/appointments.category";
import { MEDICAL_CATEGORY } from "./categories/medical.category";
import { NOTIFICATIONS_CATEGORY } from "./categories/notifications.category";
import { PRIVACY_CATEGORY } from "./categories/privacy.category";
import type { HelpCategory } from "../types/helpCenter.types";

export const HELP_CATEGORIES: readonly HelpCategory[] = [
  APPOINTMENTS_CATEGORY,
  ACCOUNT_CATEGORY,
  MEDICAL_CATEGORY,
  NOTIFICATIONS_CATEGORY,
  PRIVACY_CATEGORY,
];

export const HELP_CATEGORY_IDS = {
  appointments: "appointments",
  account: "account",
  medical: "medical",
  notifications: "notifications",
  privacy: "privacy",
} as const;

export const findHelpCategory = (categoryId?: string | null): HelpCategory | undefined =>
  categoryId ? HELP_CATEGORIES.find((category) => category.id === categoryId) : undefined;
