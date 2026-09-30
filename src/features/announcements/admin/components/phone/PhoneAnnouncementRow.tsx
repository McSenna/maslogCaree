import { EllipsisVertical, Pencil, Trash2 } from "lucide-react-native";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import type { Announcement } from "../../adminAnnouncement.types";
import { eventLine, expiryShort, postedLine, statusOf } from "../../adminAnnouncementModel";
import { IconButton, SecondaryButton } from "../ui/Buttons";
import StatusLabel from "../ui/StatusLabel";

type RowProps = {
  item: Announcement;
  expanded: boolean;
  /** First and last rows round the card's corners. */
  first: boolean;
  last: boolean;
  onToggle: (id: string) => void;
  onEdit: (item: Announcement) => void;
  onDelete: (item: Announcement) => void;
};

const PhoneAnnouncementRow = ({ item, expanded, first, last, onToggle, onEdit, onDelete }: RowProps) => (
  <View
    className={`mx-4 overflow-hidden border-x border-b border-x-line ${first ? "rounded-t-panel border-t border-t-line" : ""} ${last ? "rounded-b-panel border-b-line" : "border-b-divider"} ${expanded ? "bg-rowopen" : "bg-canvas"}`}
  >
    <View className="flex-row gap-1 py-3.5 pl-4 pr-1">
      <View className="min-w-0 flex-1">
        <Pressable
          onPress={() => onToggle(item.id)}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityHint={expanded ? "Hides the details" : "Shows the full message and actions"}
          hitSlop={{ top: 12, bottom: 12 }}
        >
          {({ pressed }) => (
            <Text className={`font-ps-semibold text-15 ${pressed ? "text-brand" : "text-ink"}`}>{item.title}</Text>
          )}
        </Pressable>
        <Text numberOfLines={expanded ? undefined : 2} className="mt-1 font-ps text-14 leading-21 text-text3">
          {item.body}
        </Text>
        <View className="mt-2 flex-row flex-wrap items-center gap-x-3 gap-y-1.5">
          <StatusLabel status={statusOf(item)} compact />
          <Text className="font-ps text-13 text-text2">{item.audience}</Text>
          <Text className="font-ps text-13 text-text2">{expiryShort(item)}</Text>
        </View>
      </View>
      <IconButton
        label={expanded ? "Close actions" : "More actions"}
        icon={EllipsisVertical}
        expanded={expanded}
        onPress={() => onToggle(item.id)}
      />
    </View>

    {expanded ? (
      <View className="gap-3 px-4 pb-4">
        <View className="gap-1">
          <Text className="font-ps text-13 text-text2">{postedLine(item)}</Text>
          <Text className="font-ps text-13 text-text2">{eventLine(item)}</Text>
        </View>
        <View className="flex-row gap-2">
          <SecondaryButton fill label="Edit" icon={Pencil} onPress={() => onEdit(item)} />
          <SecondaryButton fill tone="danger" label="Delete" icon={Trash2} onPress={() => onDelete(item)} />
        </View>
      </View>
    ) : null}
  </View>
);

export default memo(PhoneAnnouncementRow);
