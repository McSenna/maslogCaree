import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { CARD_SHADOW } from "../usersTheme";
import { DETAIL_RADIUS, useUserDetailsPalette } from "./detailsTheme";

type DetailCardProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  children: ReactNode;
  grow?: boolean;
};

const DetailCard = ({ icon, title, children, grow = false }: DetailCardProps) => {
  const palette = useUserDetailsPalette();

  return (
    <View
      className={`w-full border ${grow ? "flex-1" : ""}`}
      style={{
        borderRadius: DETAIL_RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View
        className="flex-row items-center gap-2.5 px-5 py-4"
        style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
      >
        <View
          className="h-8 w-8 items-center justify-center"
          style={{ borderRadius: DETAIL_RADIUS.well, backgroundColor: palette.infoWell }}
        >
          <Feather name={icon} size={15} color={palette.infoIcon} />
        </View>
        <Text className="text-[15px] font-bold" style={{ color: palette.heading }}>
          {title}
        </Text>
      </View>

      <View className="px-5 py-2">{children}</View>
    </View>
  );
};

export default DetailCard;
