import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import ScreenScroll from "@/components/layout/ScreenScroll";

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const announcements = [
  {
    title: "Free Medical Checkup",
    date: "March 20, 2026",
    description:
      "Barangay Maslog Health Center will conduct a free medical checkup for all residents.",
    icon: "activity",
    color: "#10B981",
    bg: "#ECFDF5",
    tag: "Medical",
  },
  {
    title: "Vaccination Program",
    date: "March 25, 2026",
    description:
      "Free vaccination for children ages 0–5 at the Barangay Health Center.",
    icon: "shield",
    color: "#2D5BFF",
    bg: "#EFF6FF",
    tag: "Vaccination",
  },
  {
    title: "Nutrition Awareness Seminar",
    date: "April 2, 2026",
    description:
      "Join our seminar about proper nutrition and healthy lifestyle habits.",
    icon: "book-open",
    color: "#F59E0B",
    bg: "#FFFBEB",
    tag: "Seminar",
  },
  {
    title: "Community Health Day",
    date: "April 10, 2026",
    description:
      "Free blood pressure and diabetes screening for all residents.",
    icon: "heart",
    color: "#EF4444",
    bg: "#FFF1F2",
    tag: "Screening",
  },
];

type FeaturedCardProps = (typeof announcements)[0] & {
  isTablet: boolean;
  onViewDetails?: () => void;
};

function FeaturedCard({
  title,
  date,
  description,
  icon,
  color,
  bg,
  tag,
  isTablet,
  onViewDetails,
}: FeaturedCardProps) {
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
          <View
            className="rounded-2xl p-3"
            style={{ backgroundColor: bg }}
          >
            <Feather name={icon as any} size={isTablet ? 24 : 20} color={color} />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1.5 flex-wrap">
              <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: bg }}>
                <Text
                  className="font-black uppercase tracking-wide"
                  style={{ color, fontSize: isTablet ? 10 : 9 }}
                >
                  {tag}
                </Text>
              </View>
              <View className="rounded-full px-2.5 py-0.5 bg-blue-50">
                <Text className="font-black uppercase tracking-wide text-blue-600"
                  style={{ fontSize: isTablet ? 10 : 9 }}>
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
            <View
              className="rounded-lg p-1.5"
              style={{ backgroundColor: "#F8FAFC" }}
            >
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
              <Text
                className="font-bold"
                style={{ color, fontSize: isTablet ? 12 : 11 }}
              >
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

function AnnouncementCard({
  title,
  date,
  description,
  icon,
  color,
  bg,
  tag,
  isTablet,
}: (typeof announcements)[0] & { isTablet: boolean }) {
  return (
    <View
      className="bg-white rounded-2xl px-4 py-4"
      style={{
        borderWidth: 1,
        borderColor: "#F1F5F9",
        boxShadow: "0px 2px 6px rgba(15,23,42,0.04)",
        elevation: 2,
      }}
    >
      <View className="flex-row items-start gap-3">
        <View className="rounded-xl p-2.5 shrink-0" style={{ backgroundColor: bg }}>
          <Feather name={icon as any} size={isTablet ? 20 : 17} color={color} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1 flex-wrap">
            <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: bg }}>
              <Text
                className="font-black uppercase tracking-wide"
                style={{ color, fontSize: isTablet ? 9 : 8 }}
              >
                {tag}
              </Text>
            </View>
          </View>
          <Text
            className="font-bold text-slate-800 leading-snug"
            style={{ fontSize: isTablet ? 14 : 13 }}
          >
            {title}
          </Text>
          <Text
            className="text-slate-400 leading-relaxed mt-0.5"
            style={{ fontSize: isTablet ? 12 : 11 }}
          >
            {description}
          </Text>
        </View>
      </View>

      <View
        className="mt-3 pt-3 flex-row items-center gap-1.5"
        style={{ borderTopWidth: 1, borderTopColor: "#F1F5F9" }}
      >
        <Feather name="calendar" size={11} color="#CBD5E1" />
        <Text
          className="font-semibold text-slate-400"
          style={{ fontSize: isTablet ? 12 : 10.5 }}
        >
          {date}
        </Text>
      </View>
    </View>
  );
}

export default function Announcements() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  const [featured, ...rest] = announcements;

  return (
    <ScreenScroll>
      <View className="gap-6" style={{ paddingHorizontal: isDesktop ? 48 : 0 }}>

        {/* ── HERO HEADER ── */}
        <View
          className="overflow-hidden rounded-3xl"
          style={{
            backgroundColor: "#7988d2",
            boxShadow: "0px 6px 20px rgba(45,91,255,0.2)",
            elevation: 8,
          }}
        >
          {/* Decorative orbs */}
          <View
            className="absolute rounded-full"
            style={{
              width: 220, height: 220,
              top: -70, right: -50,
              backgroundColor: "rgba(45,91,255,0.15)",
            }}
          />
          <View
            className="absolute rounded-full"
            style={{
              width: 100, height: 100,
              bottom: -30, left: 20,
              backgroundColor: "rgba(16,185,129,0.1)",
            }}
          />

          <View
            className="px-6 pt-7 pb-7"
            style={{ paddingHorizontal: isTablet ? 32 : 24 }}
          >
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
                <Text
                  className="font-black text-white"
                  style={{ fontSize: isTablet ? 24 : 20 }}
                >
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
              Stay updated with the latest activities, programs, and health
              reminders from your community.
            </Text>

            <View className="self-start flex-row items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2">
              <Feather name="calendar" size={12} color="rgba(255,255,255,0.75)" />
              <Text
                className="font-bold text-white/75"
                style={{ fontSize: isTablet ? 12 : 11 }}
              >
                {announcements.length} Upcoming Events
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-2.5">
          <View className="flex-row items-center gap-2 px-1">
            <View className="w-1 h-4 rounded-full bg-blue-500" />
            <Text
              className="font-black uppercase tracking-widest text-slate-400"
              style={{ fontSize: isTablet ? 11 : 9.5 }}
            >
              Next Event
            </Text>
          </View>
          <FeaturedCard {...featured} isTablet={isTablet} />
        </View>

        <View className="gap-2.5">
          <View className="flex-row items-center gap-2 px-1">
            <View className="w-1 h-4 rounded-full bg-slate-300" />
            <Text
              className="font-black uppercase tracking-widest text-slate-400"
              style={{ fontSize: isTablet ? 11 : 9.5 }}
            >
              More Upcoming
            </Text>
          </View>

          {isDesktop ? (
            <View className="flex-row flex-wrap gap-3">
              {rest.map((item, index) => (
                <View key={index} style={{ width: "48%" }}>
                  <AnnouncementCard {...item} isTablet={isTablet} />
                </View>
              ))}
            </View>
          ) : (
            <View className="gap-2.5">
              {rest.map((item, index) => (
                <AnnouncementCard key={index} {...item} isTablet={isTablet} />
              ))}
            </View>
          )}
        </View>
        <View className="flex-row items-center justify-center gap-2 py-3">
          <View className="rounded-full p-1.5" style={{ backgroundColor: "#F1F5F9" }}>
            <Feather name="info" size={11} color="#94A3B8" />
          </View>
          <Text className="text-slate-400" style={{ fontSize: isTablet ? 12 : 11 }}>
            All events are free for Barangay Maslog residents
          </Text>
        </View>

      </View>
    </ScreenScroll>
  );
}