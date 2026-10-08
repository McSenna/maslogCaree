import { Text, View } from "react-native";

import { TableButton, TableText, TableTwoLine, type Column } from "@/components/data-table";
import { TABLE_TEXT } from "@/components/data-table/tableTokens";
import { useThemeColors } from "@/hooks/useThemeColors";
import { TYPE } from "@/theme/typography";

import type { Announcement } from "../../adminAnnouncement.types";
import { eventLine, expiryLong, formatDay, postedLine, statusOf } from "../../adminAnnouncementModel";
import StatusLabel from "../ui/StatusLabel";
import AnnouncementTitle from "./AnnouncementTitle";

type Handlers = {
  expandedId: string | null;
  onToggle: (id: string) => void;
  onEdit: (item: Announcement) => void;
  onDelete: (item: Announcement) => void;
};

/** Announcements, declared once for the header, rows, skeleton and phone cards. */
export const announcementColumns = ({ expandedId, onToggle, onEdit, onDelete }: Handlers): Column<Announcement>[] => [
  {
    key: "title",
    header: "Title",
    flex: 3,
    minWidth: 240,
    render: (item) => <AnnouncementTitle item={item} expanded={item.id === expandedId} onToggle={onToggle} />,
  },
  { key: "audience", header: "Audience", flex: 1, minWidth: 120, accessor: (item) => item.audience },
  { key: "status", header: "Status", width: 130, cardRole: "badge", render: (item) => <StatusLabel status={statusOf(item)} /> },
  {
    key: "posted",
    header: "Posted",
    flex: 1,
    minWidth: 150,
    hideBelow: "lg",
    render: (item) => <TableTwoLine value={formatDay(item.createdAt)} detail={item.authorName || undefined} />,
  },
  {
    key: "expires",
    header: "Expires",
    width: 130,
    hideBelow: "lg",
    render: (item) => {
      const muted = !item.expiresAt || statusOf(item) === "expired";
      return <TableText value={item.expiresAt ? formatDay(item.expiresAt) : "None"} tone={muted ? "muted" : "body"} />;
    },
  },
  {
    key: "actions",
    header: "Actions",
    width: 160,
    render: (item) => {
      const expanded = item.id === expandedId;
      return (
        <View className="flex-row items-center gap-2">
          <TableButton
            variant="text"
            iconOnly
            icon={expanded ? "chevron-up" : "chevron-down"}
            label={expanded ? "Hide details" : "Show details"}
            accessibilityLabel={`${expanded ? "Hide" : "Show"} details for ${item.title}`}
            onPress={() => onToggle(item.id)}
          />
          <TableButton iconOnly icon="edit-2" label="Edit" accessibilityLabel={`Edit ${item.title}`} onPress={() => onEdit(item)} />
          <TableButton
            variant="text"
            tone="danger"
            iconOnly
            icon="trash-2"
            label="Delete"
            accessibilityLabel={`Delete ${item.title}`}
            onPress={() => onDelete(item)}
          />
        </View>
      );
    },
  },
];

/** The full message, its event line and its dates, under an expanded row. */
export const AnnouncementDetails = ({ item }: { item: Announcement }) => {
  const colors = useThemeColors();
  return (
    <View className="max-w-[760px] gap-2">
      <Text style={[TYPE.body, { color: colors.body }]}>{item.body}</Text>
      <Text style={[TABLE_TEXT.secondary, { color: colors.muted }]}>{`${eventLine(item)}.`}</Text>
      <Text style={[TABLE_TEXT.secondary, { color: colors.muted }]}>{`${postedLine(item)}. ${expiryLong(item)}.`}</Text>
    </View>
  );
};
