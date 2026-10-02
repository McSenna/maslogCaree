// The Users screen draws with the announcement palette (same tokens, light and
// dark); this re-export keeps the users code from reaching into that feature's internals.
export { useAnnouncementTheme as useUsersTheme } from "@/features/announcements/admin/useAnnouncementTheme";
