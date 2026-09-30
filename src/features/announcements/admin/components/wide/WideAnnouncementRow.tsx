import { ChevronDown, Pencil, Trash2 } from "lucide-react-native";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { useInteractionState } from "@/hooks/useInteractionState";

import type { Announcement } from "../../adminAnnouncement.types";
import { eventLine, expiryLong, formatDay, postedLine, statusOf } from "../../adminAnnouncementModel";
import { IconButton } from "../ui/Buttons";
import StatusLabel from "../ui/StatusLabel";
import { COLUMN, type TableMode } from "./tableColumns";

type RowProps = {
  item: Announcement;
  expanded: boolean;
  last: boolean;
  mode: TableMode;
  onToggle: (id: string) => void;
  onEdit: (item: Announcement) => void;
  onDelete: (item: Announcement) => void;
};

const TitleButton = ({ item, expanded, onToggle }: Pick<RowProps, "item" | "expanded" | "onToggle">) => {
  const { hovered, pressed, handlers } = useInteractionState({ pressScale: 1 });
  const active = hovered || pressed;

  return (
    <Pressable
      {...handlers}
      onPress={() => onToggle(item.id)}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityHint={expanded ? "Hides the full message" : "Shows the full message"}
      className="self-start web:cursor-pointer"
    >
      <Text className={`font-ps-semibold text-14 ${active ? "text-brand underline" : "text-ink"}`}>{item.title}</Text>
    </Pressable>
  );
};

const WideAnnouncementRow = ({ item, expanded, last, mode, onToggle, onEdit, onDelete }: RowProps) => {
  // Hover tint only; the row itself is not a button, its title and icons are.
  const { hovered, handlers } = useInteractionState({ pressScale: 1 });
  const status = statusOf(item);
  const edge = last ? "rounded-b-panel border-b-line" : "border-b-divider";
  const expiresMuted = !item.expiresAt || status === "expired";

  return (
    <Pressable
      onHoverIn={handlers.onHoverIn}
      onHoverOut={handlers.onHoverOut}
      accessible={false}
      focusable={false}
      className={`border-x border-b border-x-line ${edge} ${expanded || hovered ? "bg-rowopen" : "bg-canvas"}`}
    >
      <View className="min-h-[68px] flex-row items-center gap-6 px-4 py-3">
        <View className="min-w-0 flex-1">
          <TitleButton item={item} expanded={expanded} onToggle={onToggle} />
          <Text numberOfLines={1} className="mt-0.5 font-ps text-13 text-text2">
            {item.body}
          </Text>
        </View>
        <Text className={`${COLUMN.audience} font-ps text-14 text-ink`}>{item.audience}</Text>
        <View className={COLUMN.status}>
          <StatusLabel status={status} />
        </View>
        {mode === "full" ? (
          <View className={COLUMN.posted}>
            <Text className="font-ps text-13 text-ink">{formatDay(item.createdAt)}</Text>
            {item.authorName ? (
              <Text numberOfLines={1} className="font-ps text-13 text-text2">
                {item.authorName}
              </Text>
            ) : null}
          </View>
        ) : null}
        {mode === "full" ? (
          <Text className={`${COLUMN.expires} font-ps text-13 ${expiresMuted ? "text-text2" : "text-ink"}`}>
            {item.expiresAt ? formatDay(item.expiresAt) : "None"}
          </Text>
        ) : null}
        <View className={`${COLUMN.actions} flex-row justify-end gap-1`}>
          <IconButton
            size={40}
            label={expanded ? "Hide details" : "Show details"}
            icon={ChevronDown}
            flipped={expanded}
            expanded={expanded}
            onPress={() => onToggle(item.id)}
          />
          <IconButton size={40} label="Edit announcement" icon={Pencil} onPress={() => onEdit(item)} />
          <IconButton size={40} label="Delete announcement" icon={Trash2} tone="danger" onPress={() => onDelete(item)} />
        </View>
      </View>

      {expanded ? (
        <View className="max-w-[760px] gap-2 px-4 pb-[18px]">
          <Text className="font-ps text-14 leading-23 text-body">{item.body}</Text>
          <Text className="font-ps text-13 text-text2">{`${eventLine(item)}.`}</Text>
          <Text className="font-ps text-13 text-text2">{`${postedLine(item)}. ${expiryLong(item)}.`}</Text>
        </View>
      ) : null}
    </Pressable>
  );
};

export default memo(WideAnnouncementRow);
