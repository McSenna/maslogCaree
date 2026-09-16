import { Text, View } from "react-native";
import type { OrganizationMember } from "@/types/organization";
import { BHW_PALETTE, HC } from "../constants/aboutTheme";
import { initialsOf } from "../utils/organizationChart";

type BhwCardProps = {
  member: OrganizationMember;
  index: number;
  isTablet: boolean;
};

const BhwCard = ({ member, index, isTablet }: BhwCardProps) => {
  const palette = BHW_PALETTE[index % BHW_PALETTE.length];
  const avatarSize = isTablet ? 46 : 38;
  const outerSize = avatarSize + 8;

  return (
    <View
      style={{
        flex: 1,
        borderRadius: 14,
        backgroundColor: HC.white,
        borderWidth: 1,
        borderColor: "#EEF2F1",
        borderTopWidth: 3,
        borderTopColor: palette.fg,
        boxShadow: "0px 4px 12px rgba(144,202,249,0.6)",
        elevation: 6,
      }}
    >
      <View
        style={{
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 6,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            borderWidth: 1.5,
            borderColor: `${palette.fg}40`,
            borderStyle: "dashed",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 7,
          }}
        >
          <View
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: palette.bg,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: `${palette.fg}30`,
            }}
          >
            <Text
              style={{
                fontSize: isTablet ? 13 : 11,
                fontWeight: "900",
                color: palette.fg,
                letterSpacing: 0.5,
              }}
            >
              {initialsOf(member.fullname)}
            </Text>
          </View>
        </View>

        <View
          style={{
            borderRadius: 6,
            width: "100%",
            alignItems: "center",
            paddingHorizontal: 4,
            paddingVertical: 4,
            marginBottom: 3,
            backgroundColor: palette.light,
          }}
        >
          <Text
            style={{
              color: palette.fg,
              fontSize: isTablet ? 10 : 8.5,
              fontWeight: "900",
              textAlign: "center",
            }}
            numberOfLines={2}
          >
            {member.fullname}
          </Text>
        </View>

        <Text
          style={{
            color: "#9CA3AF",
            fontSize: isTablet ? 7.5 : 6.5,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            textAlign: "center",
          }}
        >
          {member.role === "bhw" ? "BHW" : "BHWN"}
        </Text>
      </View>
    </View>
  );
};

export default BhwCard;
