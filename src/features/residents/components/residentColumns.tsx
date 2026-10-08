import { View } from "react-native";

import { TablePrimaryCell, TableText, TableTwoLine, type Column } from "@/components/data-table";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import UserStatusBadge from "@/features/users/components/UserStatusBadge";
import { useUsersPalette } from "@/features/users/components/usersTheme";
import { formatTableDate } from "@/utils/dateFormatter";

import type { ResidentRecord } from "../services/residentService";
import { NOT_PROVIDED, formatContactNumber, residentAddress } from "./residentDisplay";

const ResidentIdentity = ({ resident, detail }: { resident: ResidentRecord; detail: string }) => {
  const palette = useUsersPalette();
  return (
    <View className="min-w-0 flex-row items-center gap-3 self-stretch">
      <UserAvatar
        size={40}
        imageUrl={resident.profilePhoto}
        initials={initialsFrom(resident.fullname)}
        accessibilityLabel=""
        fallbackBackgroundColor={palette.primary}
      />
      <View className="min-w-0 flex-1">
        <TablePrimaryCell title={resident.fullname} detail={detail} />
      </View>
    </View>
  );
};

/** BHW residents, declared once for the header, rows, skeleton and phone cards. */
export const residentColumns: Column<ResidentRecord>[] = [
  {
    key: "resident",
    header: "Resident",
    flex: 2.5,
    minWidth: 240,
    // The address folds under the reference when its column is hidden.
    render: (resident, _index, { hiddenKeys }) => (
      <ResidentIdentity
        resident={resident}
        detail={hiddenKeys.has("address") ? `${resident.reference} · ${residentAddress(resident)}` : resident.reference}
      />
    ),
  },
  {
    key: "contact",
    header: "Contact",
    flex: 2.2,
    minWidth: 180,
    render: (resident) => <TableTwoLine value={formatContactNumber(resident.phone)} detail={resident.email || NOT_PROVIDED} />,
  },
  {
    key: "address",
    header: "Address",
    flex: 2.3,
    minWidth: 180,
    hideBelow: "lg",
    render: (resident) => <TableText value={residentAddress(resident)} />,
  },
  {
    key: "status",
    header: "Status",
    width: 140,
    cardRole: "badge",
    render: (resident) => <UserStatusBadge status={resident.status} compact />,
  },
  { key: "registered", header: "Date registered", width: 140, accessor: (resident) => formatTableDate(resident.createdAt) },
];
