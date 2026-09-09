import type { AdminUser } from "@/services/userService";
import DetailCard from "./DetailCard";
import { InfoRows, buildAccountRows, buildPersonalRows } from "./userDetailRows";

/**
 * How to reach this account and when it was last used.
 *
 * One card of hairline-separated rows rather than five tiles: these are five
 * readings of the same record, and boxing each one separately would give a
 * phone number the same visual weight as the whole identity section.
 *
 * The phone sheet splits these same rows across two sections; the rows and
 * their fallbacks come from one place so the two surfaces cannot drift.
 */
export default function UserInformationCard({ user }: { user: AdminUser }) {
  return (
    <DetailCard icon="user" title="Personal Information" grow>
      <InfoRows rows={[...buildPersonalRows(user), ...buildAccountRows(user)]} />
    </DetailCard>
  );
}
