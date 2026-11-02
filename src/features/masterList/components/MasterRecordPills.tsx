import { Badge } from "@/components/data-table";

import type { MasterResidentRole } from "../masterList.types";
import { masterRoleLabel } from "../masterResidentRoles";

/** Classification on the official record, independent of account permissions. */
export const ResidentRolePill = ({ role }: { role?: MasterResidentRole | null }) => (
  <Badge
    tone="neutral"
    icon="user"
    label={masterRoleLabel(role)}
    accessibilityLabel={`Role: ${role === "bhw" ? "BHW (Barangay Health Worker)" : masterRoleLabel(role)}`}
  />
);
