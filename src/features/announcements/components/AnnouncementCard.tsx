import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { Announcement } from "../data/announcements";
import AnnouncementTag from "./AnnouncementTag";

type AnnouncementCardProps = {
  announcement: Announcement;
  isTablet: boolean;
};

const AnnouncementCard = ({
  announcement,
  isTablet,
}: AnnouncementCardProps) => {
  const { title, date, description, icon, color, bg, tag } = announcement;

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
          <Feather name={icon} size={isTablet ? 20 : 17} color={color} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1 flex-wrap">
            <AnnouncementTag
              label={tag}
              color={color}
              background={bg}
              fontSize={isTablet ? 9 : 8}
            />
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
};

export default AnnouncementCard;
