import type { UserRole } from "@/data/mockUsers";

/**
 * Which staff roles may open, change or close a mission schedule.
 *
 * A mirror of the server's `MISSION_MANAGER_ROLES`, kept for one purpose only:
 * deciding whether to render the "Add Mission" control. The API is the
 * authority — `POST /mission-schedule` refuses anyone else with a 403 whether
 * or not the button was ever drawn — so this is presentation, never a
 * permission check.
 *
 * Missions are the doctor's instrument: the schedule they open is what the
 * triage queue assigns every role's appointments into, so calling one is a
 * decision about the whole health team's day rather than about one service.
 */
const MISSION_MANAGER_ROLES: readonly string[] = ["doctor", "admin"];

export const canCreateMission = (role: UserRole | string | null | undefined): boolean =>
  MISSION_MANAGER_ROLES.includes(String(role ?? "").trim().toLowerCase());

/**
 * Which staff roles may schedule, move or decline an appointment.
 *
 * A mirror of the server's guard on `/appointments/:id/assign|reassign|reject`.
 * BHWs read their queue but do not act on it today, so their rows show no
 * Approve control rather than one that fails with a 403 when pressed — a
 * button that cannot work is worse than no button.
 */
const APPOINTMENT_ACTOR_ROLES: readonly string[] = ["doctor", "admin", "midwife"];

export const canAssignAppointments = (
  role: UserRole | string | null | undefined
): boolean => APPOINTMENT_ACTOR_ROLES.includes(String(role ?? "").trim().toLowerCase());
