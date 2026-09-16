import { Text, View } from "react-native";

import { HC } from "../../constants/aboutTheme";
import LeaderAvatar from "../LeaderAvatar";
import { CARD_SHADOW, type LeaderTierProps } from "./leaderCardTypes";

const MidTierCard = ({
  title,
  subtitle,
  icon,
  isTablet,
  avatarSize,
  displayName,
}: LeaderTierProps) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        borderRadius: 16,
        marginHorizontal: 4,
        backgroundColor: HC.white,
        borderWidth: 1,
        borderColor: HC.border,
        borderTopWidth: 4,
        borderTopColor: HC.teal,
        ...CARD_SHADOW,
      }}
    >
      <View
        style={{
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 12,
          paddingTop: 14,
          paddingBottom: 14,
        }}
      >
        <LeaderAvatar
          icon={icon}
          size={avatarSize}
          iconColor={HC.teal}
          ringColor={`${HC.teal}50`}
          ringWidth={1.5}
          fill={HC.tealPale}
          borderColor={HC.tealMid}
          borderWidth={1}
          marginBottom={10}
        />

        <View
          style={{
            borderRadius: 8,
            width: "100%",
            alignItems: "center",
            paddingHorizontal: 6,
            paddingVertical: 5,
            marginBottom: 4,
            backgroundColor: HC.tealPale,
          }}
        >
          <Text
            style={{
              color: HC.teal,
              fontSize: isTablet ? 11 : 9.5,
              fontWeight: "900",
              textAlign: "center",
            }}
            numberOfLines={2}
          >
            {displayName}
          </Text>
        </View>

        <Text
          style={{
            color: HC.slateLight,
            fontSize: isTablet ? 8.5 : 7.5,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: "#CBD5E1",
            fontSize: isTablet ? 7.5 : 6.5,
            textAlign: "center",
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

export default MidTierCard;
