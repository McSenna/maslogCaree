import type { UserRole } from "@/data/mockUsers";
import { fetchMyAppointments, fetchQueueOverview } from "@/services/appointments";
import { fetchMyMedicalRecords } from "@/services/medicalRecords";
import { fetchNotifications } from "@/services/notifications";
import { isResidentRole } from "../config/profileTabs";
import type { ProfileActivityItem, ProfileInsights } from "../types/profile.types";
import { toProfileActivity } from "../utils/profileActivity";
import { buildResidentStats, buildStaffStats } from "../utils/profileStats";

type CoreInsights = Omit<ProfileInsights, "activity">;

const loadResidentCore = async (): Promise<CoreInsights> => {
  const [appointments, records] = await Promise.all([
    fetchMyAppointments(),
    fetchMyMedicalRecords(),
  ]);

  return { appointments, records, stats: buildResidentStats(appointments) };
};

const loadStaffCore = async (): Promise<CoreInsights> => {
  const overview = await fetchQueueOverview();

  return {
    appointments: overview.schedule,
    records: [],
    stats: buildStaffStats(overview),
  };
};

const loadActivity = async (): Promise<ProfileActivityItem[]> => {
  try {
    const { notifications } = await fetchNotifications();
    return toProfileActivity(notifications);
  } catch {
    return [];
  }
};

export const fetchProfileInsights = async (role: UserRole): Promise<ProfileInsights> => {
  const [core, activity] = await Promise.all([
    isResidentRole(role) ? loadResidentCore() : loadStaffCore(),
    loadActivity(),
  ]);

  return { ...core, activity };
};
