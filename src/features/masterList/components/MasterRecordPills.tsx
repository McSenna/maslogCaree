import { Badge } from "@/components/data-table";

/** Record status: colour, icon and word, never colour alone. */
export const RecordStatusPill = ({ active }: { active: boolean }) =>
  active ? (
    <Badge tone="success" icon="check-circle" label="Active" spokenAs="Record status" />
  ) : (
    <Badge tone="danger" icon="x-circle" label="Inactive" spokenAs="Record status" />
  );

/** Whether an app account points at this record. The record itself is never an account. */
export const AccountLinkPill = ({ linked }: { linked: boolean }) =>
  linked ? (
    <Badge tone="info" icon="link" label="Has account" spokenAs="Account status" />
  ) : (
    <Badge tone="neutral" icon="minus" label="No account" spokenAs="Account status" />
  );
