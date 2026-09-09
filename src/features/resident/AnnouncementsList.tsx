import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import DashboardCard from "@/components/resident/DashboardCard";
import SectionHeader from "@/components/resident/SectionHeader";
import { CARD, RESIDENT_COLORS, TONES } from "@/components/resident/residentTheme";
import type { Announcement } from "@/types/residentDashboard";

type AnnouncementsListProps = {
  announcements: Announcement[];
  onViewAll: () => void;
  onAnnouncementPress: (announcement: Announcement) => void;
};

const AnnouncementItem = ({
  announcement,
  onPress,
}: {
  announcement: Announcement;
  onPress: () => void;
}) => {
  const tone = TONES[announcement.tone];
  const meta = announcement.detail
    ? `${announcement.date}  •  ${announcement.detail}`
    : announcement.date;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${announcement.title}, ${meta}`}
      android_ripple={{ color: `${tone.fg}14` }}
      className="w-full flex-row items-center gap-3 px-1 py-2.5 active:opacity-75"
      // Comfortably above the 44px touch-target minimum.
      style={{ minHeight: 56 }}
    >
      <View
        className="h-10 w-10 shrink-0 items-center justify-center"
        style={{ backgroundColor: tone.bg, borderRadius: CARD.radiusSm }}
      >
        <Ionicons name={announcement.icon} size={19} color={tone.fg} />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="text-[14px] font-semibold"
          numberOfLines={1}
          style={{ color: RESIDENT_COLORS.heading }}
        >
          {announcement.title}
        </Text>
        <Text className="mt-0.5 text-[12.5px]" numberOfLines={1} style={{ color: RESIDENT_COLORS.muted }}>
          {meta}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={RESIDENT_COLORS.subtle} />
    </Pressable>
  );
};

const AnnouncementsList = ({
  announcements,
  onViewAll,
  onAnnouncementPress,
}: AnnouncementsListProps) => (
  <DashboardCard>
    <SectionHeader title="Latest Announcements" actionLabel="View All" onActionPress={onViewAll} />

    {announcements.length === 0 ? (
      <View className="items-center py-8">
        <Text className="text-[13px]" style={{ color: RESIDENT_COLORS.muted }}>
          No announcements right now.
        </Text>
      </View>
    ) : (
      <View className="mt-2 w-full">
        {announcements.map((announcement) => (
          <AnnouncementItem
            key={announcement.id}
            announcement={announcement}
            onPress={() => onAnnouncementPress(announcement)}
          />
        ))}
      </View>
    )}
  </DashboardCard>
);

export default AnnouncementsList;
