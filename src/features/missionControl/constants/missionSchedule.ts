/**
 * The time range a new mission schedule opens with.
 *
 * A morning clinic is the common case, so the form starts there rather than
 * empty — the health worker adjusts it when the mission runs later.
 */
export const DEFAULT_MISSION_TIME = { start: "08:00", end: "12:00" } as const;

/**
 * The slot length used when the server catalogue names neither a fixed
 * duration nor a minimum for a service.
 *
 * The server applies its own default on write; this only decides what the form
 * shows before it is saved.
 */
export const FALLBACK_DURATION_MINUTES = 15;
