import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { webTransition } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";
import type { Announcement } from "@/types/residentDashboard";

type AnnouncementsListProps = {
  palette: AdminDashboardPalette;
  announcements: Announcement[];
  onViewAll: () => void;
  onAnnouncementPress: (announcement: Announcement) => void;
  fill?: boolean;
};

const ROW_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color") });

const AnnouncementItem = ({
  palette,
  announcement,
  onPress,
  first,
}: {
  palette: AdminDashboardPalette;
  announcement: Announcement;
  onPress: () => void;
  first: boolean;
}) => {
  const { hovered, pressed, focused, handlers } = useInteractionState();
  // Unread items are drawn in the primary tone (the mapper marks them "blue"); read ones recede.
  const unread = announcement.tone === "blue";
  const tone = unread ? palette.tones.blue : palette.tones.purple;
  const meta = announcement.detail ? `${announcement.date}. ${announcement.detail}` : announcement.date;

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${unread ? "New. " : ""}${announcement.title}. ${meta}`}
      className="w-full flex-row items-center gap-3 px-2 py-3"
      style={[
        {
          minHeight: 60,
          borderTopWidth: first ? 0 : 1,
          borderColor: palette.divider,
          borderRadius: 8,
          backgroundColor: hovered || pressed ? palette.hoverBg : "transparent",
          outlineWidth: focused ? 2 : 0,
          outlineStyle: "solid",
          outlineColor: palette.focusRing,
          outlineOffset: -2,
        },
        ROW_WEB,
      ]}
    >
      <View className="h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: tone.iconBg }}>
        <Feather name={unread ? "volume-2" : "file-text"} size={18} color={tone.icon} />
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-[14px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
          {announcement.title}
        </Text>
        <Text className="mt-0.5 text-[12.5px]" numberOfLines={1} style={{ color: palette.muted }}>
          {meta}
        </Text>
      </View>

      <Feather name="chevron-right" size={18} color={palette.subtle} />
    </Pressable>
  );
};

const AnnouncementsList = ({
  palette,
  announcements,
  onViewAll,
  onAnnouncementPress,
  fill = false,
}: AnnouncementsListProps) => (
  <PanelCard
    palette={palette}
    title="Announcements"
    icon="volume-2"
    subtitle="From your barangay health center"
    onViewAll={onViewAll}
    viewAllLabel="All"
    fill={fill}
  >
    {announcements.length === 0 ? (
      <EmptyPanelState palette={palette} icon="volume-2" message="No announcements right now." />
    ) : (
      <View className="w-full">
        {announcements.map((announcement, index) => (
          <AnnouncementItem
            key={announcement.id}
            palette={palette}
            announcement={announcement}
            first={index === 0}
            onPress={() => onAnnouncementPress(announcement)}
          />
        ))}
      </View>
    )}
  </PanelCard>
);

export default AnnouncementsList;
