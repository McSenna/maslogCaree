import type { OrganizationMember } from "@/types/organization";
import { BHW_COLUMNS } from "../constants/aboutTheme";

export const healthWorkers = (members: OrganizationMember[]): OrganizationMember[] => {
  return members.filter((member) => member.role === "bhw" || member.role === "bhwn");
};

export const memberInRole = (
  members: OrganizationMember[],
  role: string
): OrganizationMember | undefined => {
  return members.find((member) => member.role === role);
};

export const toGridRows = (members: OrganizationMember[]): OrganizationMember[][] => {
  const rows: OrganizationMember[][] = [];
  for (let index = 0; index < members.length; index += BHW_COLUMNS) {
    rows.push(members.slice(index, index + BHW_COLUMNS));
  }
  return rows;
};

export const initialsOf = (fullname: string): string => {
  return fullname
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};
