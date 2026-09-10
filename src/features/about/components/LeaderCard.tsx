import { Text, View } from "react-native";
import type { Feather } from "@expo/vector-icons";
import { HC } from "../constants/aboutTheme";
import LeaderAvatar from "./LeaderAvatar";

export type LeaderTier = "top" | "mid";

type LeaderCardProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
  /** Absent when the post is currently unfilled. */
  name?: string;
  /** `top` is the captain's dark card; `mid` the pair beneath it. */
  tier: LeaderTier;
  isTablet: boolean;
};

const CARD_SHADOW = {
  boxShadow: "0px 4px 12px rgba(144,202,249,0.6)",
  elevation: 6,
} as const;

/**
 * One post in the org chart.
 *
 * The top tier is a dark card and the middle tier a light one — a deliberate
 * difference, so the hierarchy reads at a glance rather than only through the
 * connector lines.
 */
export default function LeaderCard({
  title,
  subtitle,
  icon,
  name,
  tier,
  isTablet,
}: LeaderCardProps) {
  const isTop = tier === "top";
  const avatarSize = isTop ? (isTablet ? 64 : 54) : isTablet ? 52 : 44;
  const displayName = name ?? "— Unassigned —";

  if (isTop) {
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
  }

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
}
