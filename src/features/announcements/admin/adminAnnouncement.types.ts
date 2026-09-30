import type { Audience } from "../announcement.types.ts";

export type { Audience };

export type Status = "active" | "draft" | "expired";

/** One row of the admin announcements screen, mapped from the API in toAdminAnnouncement. */
export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: Audience;
  /** Null when the author's account no longer exists. */
  authorName: string | null;
  /** ISO; null only if the API ever omits it. */
  createdAt: string | null;
  expiresAt: string | null;
  isDraft: boolean;
  /** The event being announced, shown in the expanded details. */
  eventAt: string;
  location: string;
}

export type AudienceFilter = "all" | Audience;

export type StatusFilter = "all" | Status;

export type StatusCounts = Record<StatusFilter, number>;
