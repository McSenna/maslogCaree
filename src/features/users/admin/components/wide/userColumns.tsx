import { TableTwoLine, type Column } from "@/components/data-table";
import DashboardRoleBadge from "@/components/dashboard/admin/DashboardRoleBadge";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { User } from "../../userAdmin.types";
import { COLUMN_WIDTHS, actionWidthsForPermission } from "../../userColumnWidths";
import { roleToApi } from "../../userAdminModel";
import { lastLoginLines } from "../../userDates";
import PortalAccessCell from "../shared/PortalAccessCell";
import UserRowActions, { type UserRowActionHandlers } from "../shared/UserRowActions";
import UserIdentity from "../ui/UserIdentity";
import UserStatusPill from "../ui/UserStatusPill";
import NameButton from "./NameButton";

const RoleBadge = ({ role }: { role: string }) => {
  const palette = useAdminSurfacePalette();
  return <DashboardRoleBadge role={role} palette={palette} isDark={palette.isDark} />;
};

export const userColumns = (handlers: UserRowActionHandlers, canManageWebAccess = false): Column<User>[] => {
  const widths = COLUMN_WIDTHS;
  return [
  {
    key: "user", nameColumn: true,
    header: "User",
    flex: 1,
    minWidth: widths.userMin,
    cardRole: "title",
    render: (user, _index, { hiddenKeys }) => (
      <UserIdentity
        name={user.fullName}
        avatarUrl={user.avatarUrl}
        detail={hiddenKeys.has("role") ? user.role : undefined}
        nameSlot={<NameButton name={user.fullName} onPress={() => handlers.onOpenProfile(user.id)} />}
      />
    ),
  },
  // Equal flex weights share spare space evenly while preserving each column's content minimum.
  { key: "role", header: "Role", flex: 1, minWidth: widths.role, hideBelow: "lg", render: (user) => <RoleBadge role={roleToApi(user.role)} /> },
  { key: "status", header: "Account status", flex: 1, minWidth: widths.status, render: (user) => <UserStatusPill status={user.status} /> },
  { key: "access", header: "Portal access", flex: 1, minWidth: widths.access, render: (user) => <PortalAccessCell state={user.portalAccess.state} /> },
  {
    key: "lastLogin",
    header: "Last login",
    flex: 1,
    minWidth: widths.lastLogin,
    render: (user) => {
      const login = lastLoginLines(user.lastLoginAt);
      return <TableTwoLine value={login.date} detail={login.time} tone={login.time ? "body" : "muted"} />;
    },
  },
  {
    key: "actions",
    header: "Actions",
    align: "center",
    cardRole: "actions",
    flex: 1,
    minWidth: actionWidthsForPermission(canManageWebAccess).column,
    render: (user) => <UserRowActions user={user} {...handlers} />,
  },
  ];
};
