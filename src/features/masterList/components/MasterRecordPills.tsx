import StatusPill from "@/components/dashboard/kit/StatusPill";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

/** Record status: colour, icon and word, never colour alone. */
export const RecordStatusPill = ({ active }: { active: boolean }) => {
  const palette = useAdminSurfacePalette();
  return active ? (
    <StatusPill palette={palette} tone="success" icon="check-circle" label="Active" />
  ) : (
    <StatusPill palette={palette} tone="neutral" icon="slash" label="Inactive" />
  );
};

/** Whether an app account points at this record. The record itself is never an account. */
export const AccountLinkPill = ({ linked }: { linked: boolean }) => {
  const palette = useAdminSurfacePalette();
  return linked ? (
    <StatusPill palette={palette} tone="info" icon="link" label="Has account" />
  ) : (
    <StatusPill palette={palette} tone="neutral" icon="minus" label="No account" />
  );
};
