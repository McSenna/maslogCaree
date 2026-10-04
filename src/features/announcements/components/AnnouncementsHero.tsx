import { PALETTE, withAlpha } from "@/theme/palette";
import { RADII } from "@/theme/radius";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

type AnnouncementsHeroProps = {
  eventCount: number;
  isTablet: boolean;
};

// White text stays at 85% opacity or more: lighter tints drop below 4.5:1 on blue-700.
const AnnouncementsHero = ({
  eventCount,
  isTablet,
}: AnnouncementsHeroProps) => {
  const eventLabel = `${eventCount} upcoming ${eventCount === 1 ? "event" : "events"}`;

  return (
    <View
      className="overflow-hidden"
      style={{
        borderRadius: 20,
        backgroundColor: PALETTE.blue[700],
      }}
    >
      <View style={{ paddingHorizontal: isTablet ? 32 : 24, paddingVertical: isTablet ? 32 : 24, gap: 16 }}>
        <View className="flex-row items-center gap-3">
          <View
            className="p-3"
            style={{
              borderRadius: RADII.medium,
              backgroundColor: withAlpha(PALETTE.white, 0.16),
            }}
          >
            <Feather name="bell" size={isTablet ? 26 : 22} color={PALETTE.white} />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text
              className="font-bold uppercase"
              style={{ color: withAlpha(PALETTE.white, 0.85), fontSize: 12, letterSpacing: 1.2 }}
            >
              Barangay Maslog
            </Text>
            <Text
              accessibilityRole="header"
              className="font-black text-white"
              style={{ fontSize: isTablet ? 26 : 22 }}
            >
              Health announcements
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: withAlpha(PALETTE.white, 0.92),
            fontSize: isTablet ? 16 : 15,
            lineHeight: isTablet ? 24 : 22,
            maxWidth: isTablet ? 520 : undefined,
          }}
        >
          Notices and upcoming health activities from the Barangay Maslog health office.
        </Text>

        <View className="flex-row items-center gap-2">
          <Feather name="calendar" size={15} color={withAlpha(PALETTE.white, 0.9)} />
          <Text className="font-bold" style={{ color: withAlpha(PALETTE.white, 0.9), fontSize: 14 }}>
            {eventLabel}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AnnouncementsHero;
