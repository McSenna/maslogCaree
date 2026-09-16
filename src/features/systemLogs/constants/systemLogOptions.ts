
export const systemLogActions = [
  "ALL",
  "LOGIN",
  "LOGOUT",
  "LOGIN_FAILED",
  "RESIDENT_WEB_LOGIN_BLOCKED",
  "PLATFORM_ACCESS_DENIED",
  "PASSWORD_RESET_REQUESTED",
  "PASSWORD_CHANGED",
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DELETED",
  "USER_ROLE_CHANGED",
  "USER_VERIFIED",
  "USER_UNVERIFIED",
  "APPOINTMENT_CREATED",
  "APPOINTMENT_UPDATED",
  "APPOINTMENT_APPROVED",
  "APPOINTMENT_REJECTED",
  "APPOINTMENT_CANCELLED",
  "APPOINTMENT_RESCHEDULED",
  "RECORD_CREATED",
  "RECORD_UPDATED",
  "RECORD_VIEWED",
  "SCHEDULE_CREATED",
  "SCHEDULE_UPDATED",
  "SCHEDULE_DELETED",
] as const;

export const SEVERITY_OPTIONS = ["all", "info", "success", "warning", "error"] as const;

export const LOG_TYPE_OPTIONS = [
  "all",
  "User Authentication",
  "User Management",
  "Appointment Activity",
  "Patient Records",
  "Schedule Management",
  "System Event",
] as const;

export const ROLE_FILTER_OPTIONS = ["all", "admin", "doctor", "midwife", "bhw", "resident"] as const;
