import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ThemeColors } from "@/theme/colors";
import { TYPE } from "@/theme/typography";

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];

const SkeletonColumn = () => (
  <View className="min-w-0 flex-1 gap-4">
    <Skeleton style={{ height: 22, width: "60%", borderRadius: 6 }} />
    {SKELETON_ROWS.map((row) => (
      <View key={row} className="flex-row gap-3">
        <Skeleton style={{ height: 16, width: 96, borderRadius: 6 }} />
        <Skeleton style={{ height: 16, flex: 1, borderRadius: 6 }} />
      </View>
    ))}
  </View>
);

/** Same shape as the loaded view, so nothing jumps when the record arrives. */
export const ResidentDetailsSkeleton = ({ columns }: { columns: boolean }) => (
  <View accessibilityLabel="Loading resident details" accessibilityLiveRegion="polite" className="gap-6">
    <Skeleton style={{ height: 84, borderRadius: 16 }} />
    <View className={columns ? "flex-row gap-12" : "gap-8"}>
      <SkeletonColumn />
      <SkeletonColumn />
    </View>
  </View>
);

type MessageProps = {
  colors: ThemeColors;
  icon: keyof typeof Feather.glyphMap;
  tone: "danger" | "neutral";
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
};

const ResidentDetailsMessage = ({ colors, icon, tone, title, body, action }: MessageProps) => (
  <View accessibilityLiveRegion="polite" className="items-center gap-3 px-4 py-12">
    <View className="h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: colors[tone].bg }}>
      <Feather name={icon} size={24} color={colors[tone].fg} />
    </View>
    <Text accessibilityRole="header" style={[TYPE.title, { color: colors.heading, textAlign: "center" }]}>
      {title}
    </Text>
    <Text style={[TYPE.body, { color: colors.body, textAlign: "center", maxWidth: 420 }]}>{body}</Text>
    {action ? (
      <View className="mt-2">
        <Button label={action.label} icon="refresh-cw" variant="secondary" onPress={action.onPress} />
      </View>
    ) : null}
  </View>
);

export const ResidentDetailsError = ({ colors, message, onRetry }: { colors: ThemeColors; message: string; onRetry: () => void }) => (
  <ResidentDetailsMessage
    colors={colors}
    icon="wifi-off"
    tone="danger"
    title="Couldn't load this record"
    body={message}
    action={{ label: "Try again", onPress: onRetry }}
  />
);

export const ResidentDetailsNotFound = ({ colors }: { colors: ThemeColors }) => (
  <ResidentDetailsMessage
    colors={colors}
    icon="search"
    tone="neutral"
    title="This record is no longer on the master list"
    body="It may have been deleted by another admin. Close this window to see the current list."
  />
);
