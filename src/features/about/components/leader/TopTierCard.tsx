import { Text, View } from "react-native";

import { HC } from "../../constants/aboutTheme";
import LeaderAvatar from "../LeaderAvatar";
import { CARD_SHADOW, type LeaderTierProps } from "./leaderCardTypes";

const TopTierCard = ({
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
          borderRadius: 20,
          marginHorizontal: 8,
          backgroundColor: HC.navy,
          borderTopWidth: 5,
          borderTopColor: HC.tealLight,
          ...CARD_SHADOW,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "rgba(11,122,117,0.12)",
            top: -20,
            right: -20,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "rgba(20,168,159,0.08)",
            bottom: 10,
            left: -15,
          }}
        />

        <View
          style={{
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 12,
            paddingTop: 20,
            paddingBottom: 18,
          }}
        >
          <LeaderAvatar
            icon={icon}
            size={avatarSize}
            iconColor={HC.tealLight}
            ringColor={HC.tealLight}
            ringWidth={2}
            fill="rgba(11,122,117,0.25)"
            borderColor="rgba(20,168,159,0.5)"
            borderWidth={1.5}
            marginBottom={12}
          />

          <View
            style={{
              borderRadius: 10,
              width: "100%",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 6,
              marginBottom: 6,
              backgroundColor: "rgba(11,122,117,0.2)",
              borderWidth: 1,
              borderColor: "rgba(20,168,159,0.2)",
            }}
          >
            <Text
              style={{
                color: HC.tealLight,
                fontSize: isTablet ? 12 : 10.5,
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
              color: "rgba(255,255,255,0.55)",
              fontSize: isTablet ? 9 : 7.5,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 1.2,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: isTablet ? 8 : 6.5,
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

export default TopTierCard;
