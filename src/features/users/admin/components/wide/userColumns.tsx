import { View } from "react-native";

import { TableButton, TableText, TableTwoLine, type CellContext, type Column } from "@/components/data-table";
import DashboardRoleBadge from "@/components/dashboard/admin/DashboardRoleBadge";
import Checkbox from "@/components/ui/Checkbox";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { RowSelection } from "../../hooks/useRowSelection";
import type { MenuAnchor, SignupRequest, User } from "../../userAdmin.types";
import { ACCESS_LABELS, roleToApi } from "../../userAdminModel";
import { formatDate, formatTime, lastLoginLines } from "../../userDates";
import UserIdentity from "../ui/UserIdentity";
import UserStatusPill from "../ui/UserStatusPill";
import NameButton from "./NameButton";
import RowMenuButton from "./RowMenuButton";

const RoleBadge = ({ role }: { role: string }) => {
  const palette = useAdminSurfacePalette();
  return <DashboardRoleBadge role={role} palette={palette} isDark={palette.isDark} />;
};

/** The email, plus Access and Location when their columns are hidden at this width. */
const userDetail = (user: User, { hiddenKeys }: CellContext) =>
  [user.email, hiddenKeys.has("access") ? ACCESS_LABELS[user.access] : "", hiddenKeys.has("location") ? user.location : ""]
    .filter(Boolean)
    .join(" · ");

type UserHandlers = {
  selection: RowSelection;
  menuUserId: string | null;
  onOpenProfile: (id: string) => void;
  onOpenMenu: (id: string, anchor: MenuAnchor) => void;
};

export const userColumns = ({ selection, menuUserId, onOpenProfile, onOpenMenu }: UserHandlers): Column<User>[] => [
  {
    key: "select",
    header: "Select",
    width: 52,
    cardRole: "hidden",
    renderHeader: () => (
      <Checkbox
        checked={selection.allSelected}
        indeterminate={selection.count > 0 && !selection.allSelected}
        onChange={selection.toggleAll}
        accessibilityLabel="Select all users"
      />
    ),
    render: (user) => (
      <Checkbox checked={selection.isSelected(user.id)} onChange={() => selection.toggle(user.id)} accessibilityLabel={`Select ${user.fullName}`} />
    ),
  },
  {
    key: "user",
    header: "User",
    flex: 1.5,
    minWidth: 220,
    cardRole: "title",
    render: (user, _index, context) => (
      <UserIdentity
        name={user.fullName}
        avatarUrl={user.avatarUrl}
        detail={userDetail(user, context)}
        singleLine
        nameSlot={<NameButton name={user.fullName} singleLine onPress={() => onOpenProfile(user.id)} />}
      />
    ),
  },
  { key: "role", header: "Role", width: 120, cardRole: "badge", render: (user) => <RoleBadge role={roleToApi(user.role)} /> },
  { key: "access", header: "Access", width: 130, hideBelow: "lg", accessor: (user) => ACCESS_LABELS[user.access] },
  {
    key: "location",
    header: "Location",
    flex: 1.2,
    minWidth: 140,
    hideBelow: "md",
    render: (user) => <TableText value={user.location || "Not recorded"} tone={user.location ? "body" : "muted"} />,
  },
  { key: "status", header: "Status", width: 140, cardRole: "badge", render: (user) => <UserStatusPill status={user.status} /> },
  {
    key: "lastLogin",
    header: "Last login",
    width: 130,
    render: (user) => {
      const login = lastLoginLines(user.lastLoginAt);
      return <TableTwoLine value={login.date} detail={login.time} tone={login.time ? "body" : "muted"} />;
    },
  },
  {
    key: "actions",
    header: "Actions",
    width: 92,
    render: (user) => (
      <RowMenuButton name={user.fullName} open={menuUserId === user.id} onOpen={(anchor) => onOpenMenu(user.id, anchor)} />
    ),
  },
];

type RequestHandlers = { pending: boolean; onReview: (id: string, reject: boolean) => void };

/** Approve and Reject open the ID review first (Reject straight to the reasons), so no account is decided unseen. */
const RequestActions = ({ request, pending, onReview }: RequestHandlers & { request: SignupRequest }) =>
  pending ? (
    <View className="flex-row items-center gap-2">
      <TableButton label="Reject" accessibilityLabel={`Reject ${request.fullName}`} onPress={() => onReview(request.id, true)} />
      <TableButton variant="primary" label="Approve" accessibilityLabel={`Approve ${request.fullName}`} onPress={() => onReview(request.id, false)} />
    </View>
  ) : (
    // The API only decides pending requests, so a rejected one can be reviewed, not approved.
    <TableButton icon="eye" label="Review" accessibilityLabel={`Review ${request.fullName}`} onPress={() => onReview(request.id, false)} />
  );

export const requestColumns = ({ pending, onReview }: RequestHandlers): Column<SignupRequest>[] => [
  {
    key: "user",
    header: "User",
    flex: 1.5,
    minWidth: 220,
    render: (request, _index, { hiddenKeys }) => (
      <UserIdentity
        name={request.fullName}
        avatarUrl={request.avatarUrl}
        detail={hiddenKeys.has("location") && request.location ? `${request.email} · ${request.location}` : request.email}
        singleLine
      />
    ),
  },
  { key: "requested", header: "Role requested", width: 140, cardRole: "badge", render: (request) => <RoleBadge role={roleToApi(request.role)} /> },
  {
    key: "location",
    header: "Location",
    flex: 1.2,
    minWidth: 140,
    hideBelow: "md",
    render: (request) => <TableText value={request.location || "Not recorded"} tone={request.location ? "body" : "muted"} />,
  },
  {
    key: "submitted",
    header: "Submitted",
    width: 130,
    render: (request) => <TableTwoLine value={formatDate(request.submittedAt)} detail={formatTime(request.submittedAt)} />,
  },
  {
    key: "actions",
    header: "Actions",
    width: pending ? 200 : 132,
    render: (request) => <RequestActions request={request} pending={pending} onReview={onReview} />,
  },
];
