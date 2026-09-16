import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import UserStatusBadge from "@/features/users/components/UserStatusBadge";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "@/features/users/components/usersTheme";
import { formatDate } from "@/utils/dateFormatter";
import type { ResidentRecord } from "../services/residentService";
import { formatContactNumber, residentAddress } from "./residentDisplay";

type ResidentCardProps = {
  resident: ResidentRecord;
  onPress: () => void;
  dense?: boolean;
};

const ResidentCard = ({ resident, onPress, dense = false }: ResidentCardProps) => {
  const palette = useUsersPalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${resident.fullname}`}
      className="w-full flex-row items-center gap-3 border p-3 active:opacity-90"
      style={{
        minHeight: 72,
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <UserAvatar
        size={dense ? 52 : 60}
        imageUrl={resident.profilePhoto}
        initials={initialsFrom(resident.fullname)}
        accessibilityLabel={`${resident.fullname} profile photo`}
        fallbackBackgroundColor={palette.primary}
      />

      <View className="min-w-0 flex-1">
        <View className="flex-row items-start gap-2">
          <View className="min-w-0 flex-1">
            <Text
              className={dense ? "text-[16px] font-bold" : "text-[17px] font-bold"}
              numberOfLines={1}
              style={{ color: palette.heading }}
            >
              {resident.fullname}
            </Text>
            <Text
              className={dense ? "mt-0.5 text-[12px]" : "mt-0.5 text-[12.5px]"}
              numberOfLines={1}
              style={{ color: palette.subtle }}
            >
              {resident.reference}
            </Text>
          </View>

          <Feather
            name="chevron-right"
            size={20}
            color={palette.subtle}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </View>

        <View className="mt-2">
          <UserStatusBadge status={resident.status} compact />
        </View>

        <View className="mt-2 gap-1">
          <View className="flex-row items-center gap-1.5">
            <Feather name="phone" size={12} color={palette.subtle} />
            <Text
              className="min-w-0 flex-1 text-[12.5px] font-medium"
              numberOfLines={1}
              style={{ color: palette.body }}
            >
              {formatContactNumber(resident.phone)}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5">
            <Feather name="map-pin" size={12} color={palette.subtle} />
            <Text
              className="min-w-0 flex-1 text-[12.5px]"
              numberOfLines={1}
              style={{ color: palette.muted }}
            >
              {residentAddress(resident)}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5">
            <Feather name="calendar" size={12} color={palette.subtle} />
            <Text className="text-[12px]" numberOfLines={1} style={{ color: palette.subtle }}>
              Registered {formatDate(resident.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ResidentCard;

