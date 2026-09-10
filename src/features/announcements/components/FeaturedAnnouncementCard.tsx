import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { hexToRgba } from "@/utils/color";
import type { Announcement } from "../data/announcements";
import AnnouncementTag from "./AnnouncementTag";

type FeaturedAnnouncementCardProps = {
  announcement: Announcement;
  isTablet: boolean;
  onViewDetails?: () => void;
};

/** The next event, given a full-width card and its own accent stripe. */
export default function FeaturedAnnouncementCard({
  announcement,
  isTablet,
  onViewDetails,
}: FeaturedAnnouncementCardProps) {
  const { title, date, description, icon, color, bg, tag } = announcement;

  return (
    <View
      style={{
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: `0px 6px 16px ${hexToRgba(color, 0.18)}`,
        elevation: 6,
      }}
    >
      <View style={{ height: 4, backgroundColor: color }} />

      <View className="bg-white px-5 py-5">
        <View className="flex-row items-start gap-3 mb-4">
          <View className="rounded-2xl p-3" style={{ backgroundColor: bg }}>
            <Feather name={icon} size={isTablet ? 24 : 20} color={color} />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1.5 flex-wrap">
              <AnnouncementTag
                label={tag}
                color={color}
                background={bg}
                fontSize={isTablet ? 10 : 9}
                wide
              />
              <View className="rounded-full px-2.5 py-0.5 bg-blue-50">
                <Text
                  className="font-black uppercase tracking-wide text-blue-600"
                  style={{ fontSize: isTablet ? 10 : 9 }}
                >
                  Featured
                </Text>
              </View>
            </View>
            <Text
              className="font-black text-slate-900 leading-tight"
              style={{ fontSize: isTablet ? 17 : 15 }}
            >
              {title}
            </Text>
          </View>
        </View>

        <Text
          className="text-slate-500 leading-relaxed mb-4"
          style={{ fontSize: isTablet ? 13 : 12 }}
        >
          {description}
        </Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <View className="rounded-lg p-1.5" style={{ backgroundColor: "#F8FAFC" }}>
              <Feather name="calendar" size={12} color="#94A3B8" />
            </View>
            <Text
              className="font-semibold text-slate-400"
              style={{ fontSize: isTablet ? 12 : 11 }}
            >
              {date}
            </Text>
          </View>

          <Pressable
            onPress={onViewDetails}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${title}`}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View
              className="flex-row items-center gap-1.5 rounded-full px-3.5 py-2"
              style={{
                backgroundColor: `${color}10`,
                borderWidth: 1,
                borderColor: `${color}25`,
              }}
            >
              <Text className="font-bold" style={{ color, fontSize: isTablet ? 12 : 11 }}>
                View Details
              </Text>
              <Feather name="arrow-right" size={11} color={color} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
