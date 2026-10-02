import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { CardSide } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { Announcement } from "../../adminAnnouncement.types";
import { eventLine, expiryLong, formatDay, postedLine, statusOf } from "../../adminAnnouncementModel";
import StatusLabel from "../ui/StatusLabel";
import { COLUMN, type TableMode } from "./tableColumns";

type RowProps = {
  item: Announcement;
  expanded: boolean;
  first: boolean;
  mode: TableMode;
  onToggle: (id: string) => void;
  onEdit: (item: Announcement) => void;
  onDelete: (item: Announcement) => void;
};

const TitleButton = ({ item, expanded, onToggle }: Pick<RowProps, "item" | "expanded" | "onToggle">) => (
  <Pressable
    onPress={() => onToggle(item.id)}
    accessibilityRole="button"
    accessibilityState={{ expanded }}
    accessibilityHint={expanded ? "Hides the full message" : "Shows the full message"}
    className="self-start web:cursor-pointer"
  >
    {({ hovered, pressed }) => (
      <Text className={`text-[13.5px] font-semibold ${hovered || pressed ? "text-brand underline" : "text-ink"}`}>{item.title}</Text>
    )}
  </Pressable>
);

const WideAnnouncementRow = ({ item, expanded, first, mode, onToggle, onEdit, onDelete }: RowProps) => {
  const palette = useAdminSurfacePalette();
  const status = statusOf(item);
  const expiresMuted = !item.expiresAt || status === "expired";

  return (
    <CardSide>
      {/* Hover tint only; the row itself is not a button, its title and icons are. */}
      <Pressable
        accessible={false}
        focusable={false}
        className={`rounded-sm ${first ? "" : "border-t border-divider"} ${expanded ? "bg-rowopen" : "hover:bg-rowopen"}`}
      >
        <View className="min-h-16 flex-row items-center gap-3 px-3 py-2.5">
          <View className="min-w-0 flex-1">
            <TitleButton item={item} expanded={expanded} onToggle={onToggle} />
            <Text numberOfLines={1} className="mt-0.5 text-[12px] font-normal text-text2">
              {item.body}
            </Text>
          </View>
          <Text className={`${COLUMN.audience} text-[13px] font-medium text-body`}>{item.audience}</Text>
          <View className={`${COLUMN.status} items-start`}>
            <StatusLabel status={status} />
          </View>
          {mode === "full" ? (
            <View className={COLUMN.posted}>
              <Text className="text-[13px] font-medium text-ink">{formatDay(item.createdAt)}</Text>
              {item.authorName ? (
                <Text numberOfLines={1} className="text-[12px] font-normal text-text2">
                  {item.authorName}
                </Text>
              ) : null}
            </View>
          ) : null}
          {mode === "full" ? (
            <Text className={`${COLUMN.expires} text-[13px] font-medium ${expiresMuted ? "text-text2" : "text-ink"}`}>
              {item.expiresAt ? formatDay(item.expiresAt) : "None"}
            </Text>
          ) : null}
          <View className={`${COLUMN.actions} flex-row justify-end gap-1`}>
            <DashboardButton
              palette={palette}
              variant="ghost"
              size="md"
              iconOnly
              icon={expanded ? "chevron-up" : "chevron-down"}
              label={expanded ? "Hide details" : "Show details"}
              onPress={() => onToggle(item.id)}
            />
            <DashboardButton palette={palette} variant="ghost" size="md" iconOnly icon="edit-2" label="Edit announcement" onPress={() => onEdit(item)} />
            <DashboardButton palette={palette} variant="danger" size="md" iconOnly icon="trash-2" label="Delete announcement" onPress={() => onDelete(item)} />
          </View>
        </View>

        {expanded ? (
          <View className="max-w-[760px] gap-2 px-3 pb-4">
            <Text className="text-[14px] font-normal leading-[22px] text-body">{item.body}</Text>
            <Text className="text-[12.5px] font-medium text-text2">{`${eventLine(item)}.`}</Text>
            <Text className="text-[12.5px] font-medium text-text2">{`${postedLine(item)}. ${expiryLong(item)}.`}</Text>
          </View>
        ) : null}
      </Pressable>
    </CardSide>
  );
};

export default memo(WideAnnouncementRow);
