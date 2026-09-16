import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

type AnnouncementsHeroProps = {
  eventCount: number;
  isTablet: boolean;
};

const AnnouncementsHero = ({
  eventCount,
  isTablet,
}: AnnouncementsHeroProps) => {
  return (
    <View
      className="overflow-hidden rounded-3xl"
      style={{
        backgroundColor: "#7988d2",
        boxShadow: "0px 6px 20px rgba(45,91,255,0.2)",
        elevation: 8,
      }}
    >
      <View
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          top: -70,
          right: -50,
          backgroundColor: "rgba(45,91,255,0.15)",
        }}
      />
      <View
        className="absolute rounded-full"
        style={{
          width: 100,
          height: 100,
          bottom: -30,
          left: 20,
          backgroundColor: "rgba(16,185,129,0.1)",
        }}
      />

      <View className="px-6 pt-7 pb-7" style={{ paddingHorizontal: isTablet ? 32 : 24 }}>
        <View className="flex-row items-center gap-3 mb-5">
          <View
            className="rounded-2xl p-3"
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.18)",
            }}
          >
            <Feather name="bell" size={isTablet ? 26 : 22} color="#fff" />
          </View>
          <View>
            <Text
              className="font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}
            >
              Barangay Maslog
            </Text>
            <Text className="font-black text-white" style={{ fontSize: isTablet ? 24 : 20 }}>
              Health Announcements
            </Text>
          </View>
        </View>

        <Text
          className="leading-relaxed mb-5"
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: isTablet ? 14 : 13,
            maxWidth: isTablet ? 460 : undefined,
          }}
        >
          Stay updated with the latest activities, programs, and health reminders from your
          community.
        </Text>

        <View className="self-start flex-row items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2">
          <Feather name="calendar" size={12} color="rgba(255,255,255,0.75)" />
          <Text className="font-bold text-white/75" style={{ fontSize: isTablet ? 12 : 11 }}>
            {eventCount} Upcoming Events
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AnnouncementsHero;
