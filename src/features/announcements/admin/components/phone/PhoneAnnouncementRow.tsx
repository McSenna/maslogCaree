import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { CardSide } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { Announcement } from "../../adminAnnouncement.types";
import { eventLine, expiryShort, postedLine, statusOf } from "../../adminAnnouncementModel";
import StatusLabel from "../ui/StatusLabel";

type RowProps = {
  item: Announcement;
  expanded: boolean;
  first: boolean;
  onToggle: (id: string) => void;
  onEdit: (item: Announcement) => void;
  onDelete: (item: Announcement) => void;
};

/** A stacked row inside the list card, as the dashboard's tables stack on phones. */
const PhoneAnnouncementRow = ({ item, expanded, first, onToggle, onEdit, onDelete }: RowProps) => {
  const palette = useAdminSurfacePalette();
  return (
    <View className="mx-4">
      <CardSide>
        <View className={`rounded-sm ${first ? "" : "border-t border-divider"} ${expanded ? "bg-rowopen" : ""}`}>
          <View className="flex-row gap-1 py-3 pl-1">
            <View className="min-w-0 flex-1">
              <Pressable
                onPress={() => onToggle(item.id)}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                accessibilityHint={expanded ? "Hides the details" : "Shows the full message and actions"}
                hitSlop={{ top: 12, bottom: 12 }}
              >
                {({ pressed }) => (
                  <Text className={`text-[15px] font-semibold ${pressed ? "text-brand" : "text-ink"}`}>{item.title}</Text>
                )}
              </Pressable>
              <Text numberOfLines={expanded ? undefined : 2} className="mt-1 text-[14px] font-normal leading-[21px] text-body">
                {item.body}
              </Text>
              <View className="mt-2 flex-row flex-wrap items-center gap-2">
                <StatusLabel status={statusOf(item)} />
                <Text className="text-[12px] font-medium text-text2">{item.audience}</Text>
                <Text className="text-[12px] font-medium text-text2">{expiryShort(item)}</Text>
              </View>
            </View>
            <DashboardButton
              palette={palette}
              variant="ghost"
              size="md"
              iconOnly
              icon="more-vertical"
              label={expanded ? "Close actions" : "More actions"}
              onPress={() => onToggle(item.id)}
            />
          </View>

          {expanded ? (
            <View className="gap-3 px-1 pb-4">
              <View className="gap-1">
                <Text className="text-[12.5px] font-medium text-text2">{postedLine(item)}</Text>
                <Text className="text-[12.5px] font-medium text-text2">{eventLine(item)}</Text>
              </View>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <DashboardButton palette={palette} size="md" fullWidth icon="edit-2" label="Edit" onPress={() => onEdit(item)} />
                </View>
                <View className="flex-1">
                  <DashboardButton palette={palette} size="md" fullWidth variant="danger" icon="trash-2" label="Delete" onPress={() => onDelete(item)} />
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </CardSide>
    </View>
  );
};

export default memo(PhoneAnnouncementRow);
