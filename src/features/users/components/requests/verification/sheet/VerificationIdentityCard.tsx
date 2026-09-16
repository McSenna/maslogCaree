import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { DETAIL_RADIUS, useUserDetailsPalette } from "../../../details/detailsTheme";
import type { UserRequestDetail } from "../../../../services/userRequestsService";

type Props = {
  verification?: UserRequestDetail["verification"];
  showFullIdNumber: boolean;
  onToggleIdNumber: () => void;
};

const VerificationIdentityCard = ({
  verification,
  showFullIdNumber,
  onToggleIdNumber,
}: Props) => {
  const palette = useUserDetailsPalette();

  return (
    <View className="gap-2 pt-1">
      <View
        className="w-full gap-2 p-3"
        style={{
          borderRadius: DETAIL_RADIUS.card,
          backgroundColor: palette.neutralBg,
          borderWidth: 1,
          borderColor: palette.neutralBorder,
        }}
      >
        <View>
          <Text className="text-[12px]" style={{ color: palette.subtle }}>
            ID Document Type
          </Text>
          <Text className="mt-0.5 text-[14px] font-bold" style={{ color: palette.headerIcon }}>
            {verification?.idTypeName || verification?.idType}
          </Text>
        </View>

        <View
          className="flex-row items-end justify-between gap-3 pt-2"
          style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
        >
          <View className="min-w-0 flex-1">
            <Text className="text-[12px]" style={{ color: palette.subtle }}>
              ID Number
            </Text>
            <Text
              className="mt-0.5 text-[15px] font-bold"
              numberOfLines={1}
              style={{
                color: palette.heading,
                fontVariant: ["tabular-nums"],
                letterSpacing: 1,
              }}
            >
              {showFullIdNumber ? verification?.idNumber : verification?.maskedIdNumber}
            </Text>
          </View>

          <Pressable
            onPress={onToggleIdNumber}
            accessibilityRole="button"
            accessibilityLabel={
              showFullIdNumber ? "Mask the ID number" : "Reveal the full ID number"
            }
            hitSlop={10}
            className="flex-row items-center gap-1.5 px-2.5 py-1.5"
            style={{
              borderRadius: DETAIL_RADIUS.control,
              backgroundColor: palette.headerWell,
            }}
          >
            <Feather
              name={showFullIdNumber ? "eye-off" : "eye"}
              size={13}
              color={palette.headerIcon}
            />
            <Text className="text-[12px] font-semibold" style={{ color: palette.headerIcon }}>
              {showFullIdNumber ? "Mask" : "Reveal"}
            </Text>
          </Pressable>
        </View>
      </View>

      {verification?.rejectionReason ? (
        <View
          className="w-full gap-1 p-3"
          style={{
            borderRadius: DETAIL_RADIUS.card,
            backgroundColor: palette.dangerBg,
            borderWidth: 1,
            borderColor: palette.dangerBorder,
          }}
        >
          <Text
            className="text-[12px] font-bold uppercase"
            style={{ color: palette.dangerText, letterSpacing: 0.6 }}
          >
            Rejection Reason
          </Text>
          <Text className="text-[13.5px] font-semibold" style={{ color: palette.dangerText }}>
            {verification.rejectionReason}
          </Text>
          {verification.rejectionRemarks ? (
            <Text className="text-[12.5px]" style={{ color: palette.body }}>
              {verification.rejectionRemarks}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default VerificationIdentityCard;
