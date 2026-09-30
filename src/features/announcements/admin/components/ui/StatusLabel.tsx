import { Text, View } from "react-native";

import type { Status } from "../../adminAnnouncement.types";
import { STATUS_LABELS } from "../../adminAnnouncementModel";

const DOT: Record<Status, string> = {
  active: "bg-status-active",
  draft: "bg-status-draft",
  expired: "bg-status-expired",
};

/** A small coloured dot and the status word; the word carries the meaning. */
const StatusLabel = ({ status, compact }: { status: Status; compact?: boolean }) => (
  <View className="flex-row items-center gap-1.5">
    <View className={`h-2 w-2 rounded-full ${DOT[status]}`} importantForAccessibility="no" />
    <Text className={`font-ps text-ink ${compact ? "text-13" : "text-14"}`}>{STATUS_LABELS[status]}</Text>
  </View>
);

export default StatusLabel;
