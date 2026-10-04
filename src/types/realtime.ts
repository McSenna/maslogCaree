import type { AnnouncementRecord } from "@/features/announcements/announcement.types";
import type { SupportTicket } from "@/features/help-center/types/support.types";
import type { InventoryItem } from "@/features/inventory/types/inventory.types";
import type { MasterResidentRecord } from "@/features/masterList/masterList.types";
import type { MasterlistRow } from "@/features/medicalRecordMasterlist/types";
import type { NotificationItem } from "@/features/notifications/notification.types";
import type { ResidentRecord } from "@/features/residents/services/residentService";
import type { SystemLog } from "@/features/systemLogs/types/systemLog.types";
import type { ApiUser } from "@/features/users/admin/userAdmin.types";
import type { UserRequestSummary } from "@/features/users/services/userRequestTypes";
import type { AuthUser } from "@/services/auth/authTypes";
import type { MedicalRecord } from "@/services/medicalRecordTypes";
import type { AppointmentRecord, MissionScheduleRecord } from "@/types/appointments.types";

/**
 * The realtime contract, kept in step with backend/realtime/resources.js.
 * A resource is a REST view: each one carries exactly the row its list GET
 * returns for the receiving account, so a pushed record can replace a listed one.
 */
export type RealtimeRecordMap = {
  appointment: AppointmentRecord;
  myAppointment: AppointmentRecord;
  medicalRecord: MasterlistRow;
  myMedicalRecord: MedicalRecord;
  missionSchedule: MissionScheduleRecord;
  inventoryItem: InventoryItem;
  announcement: AnnouncementRecord;
  adminAnnouncement: AnnouncementRecord;
  supportTicket: SupportTicket;
  adminSupportTicket: SupportTicket;
  user: ApiUser;
  resident: ResidentRecord;
  userRequest: UserRequestSummary;
  masterResident: MasterResidentRecord;
  notification: NotificationItem;
  systemLog: SystemLog;
  profile: AuthUser;
};

export type RealtimeResource = keyof RealtimeRecordMap;

/** created/updated carry the full record, deleted carries its id, resync means "reload this list". */
export type RealtimeAction = "created" | "updated" | "deleted" | "resync";

export type DeletedPayload = { id: string };

export type RealtimePayload<R extends RealtimeResource, A extends RealtimeAction> = A extends "deleted"
  ? DeletedPayload
  : A extends "resync"
    ? Record<string, never>
    : RealtimeRecordMap[R];

export type RealtimeEventName = `${RealtimeResource}:${RealtimeAction}`;

/** What one change looks like once it reaches a hook. */
export type RealtimeChange<T> =
  | { action: "created" | "updated"; record: T }
  | { action: "deleted"; id: string }
  | { action: "resync" };

export type ConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting" | "offline";
