import type { OrganizationMember } from "@/types/organization";
import { BHW_COLUMNS } from "../constants/aboutTheme";

/** The barangay's health workers, both grades. */
export function healthWorkers(members: OrganizationMember[]): OrganizationMember[] {
  return members.filter((member) => member.role === "bhw" || member.role === "bhwn");
}

/** The person holding one post, if it is filled. */
export function memberInRole(
  members: OrganizationMember[],
  role: string
): OrganizationMember | undefined {
  return members.find((member) => member.role === role);
}

/** Health workers split into fixed-width rows for the grid. */
export function toGridRows(members: OrganizationMember[]): OrganizationMember[][] {
  const rows: OrganizationMember[][] = [];
  for (let index = 0; index < members.length; index += BHW_COLUMNS) {
    rows.push(members.slice(index, index + BHW_COLUMNS));
  }
  return rows;
}

/** "Maria Santos" → "MS", for the avatar when there is no photo. */
export function initialsOf(fullname: string): string {
  return fullname
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
