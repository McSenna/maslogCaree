import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import { formatDate } from "@/utils/dateFormatter";
import { RADIUS, useUsersPalette } from "../../usersTheme";
import type { UserRequestSummary } from "../../../services/userRequestsService";
import RequestStatusBadge from "../RequestStatusBadge";
import { REQUEST_COLUMNS } from "../userRequestsColumns";

const RequestRow = ({
  request,
  isLast,
  onReview,
}: {
  request: UserRequestSummary;
  isLast: boolean;
  onReview: () => void;
}) => {
  const palette = useUsersPalette();
  const resident = request.resident;

  return (
    <View
      className="w-full flex-row items-center"
      style={{
        minHeight: 68,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <View
        className="flex-row items-center gap-3 px-3"
        style={{ flex: REQUEST_COLUMNS.resident, minWidth: 0 }}
      >
        <UserAvatar
          size={36}
          imageUrl={resident.avatarUrl}
          initials={initialsFrom(resident.fullname)}
          accessibilityLabel={`${resident.fullname} avatar`}
          fallbackBackgroundColor={palette.primary}
        />
        <View className="min-w-0 flex-1">
          <Text
            className="text-[13.5px] font-semibold"
            numberOfLines={1}
            style={{ color: palette.heading }}
          >
            {resident.fullname || "Resident"}
          </Text>
          <Text className="text-[12px]" numberOfLines={1} style={{ color: palette.subtle }}>
            {resident.address || "No address on file"}
          </Text>
        </View>
      </View>

      <View className="px-3" style={{ flex: REQUEST_COLUMNS.contact, minWidth: 0 }}>
        <Text className="text-[13px]" numberOfLines={1} style={{ color: palette.heading }}>
          {resident.email || "—"}
        </Text>
        <Text className="text-[12px]" numberOfLines={1} style={{ color: palette.subtle }}>
          {resident.phone || "No contact number"}
        </Text>
      </View>

      <View className="px-3" style={{ flex: REQUEST_COLUMNS.idType, minWidth: 0 }}>
        <Text className="text-[13px]" numberOfLines={1} style={{ color: palette.heading }}>
          {request.idTypeName || request.idType}
        </Text>
        <Text
          className="text-[12px]"
          numberOfLines={1}
          style={{ color: palette.subtle, fontVariant: ["tabular-nums"] }}
        >
          {request.maskedIdNumber || "••••"}
        </Text>
      </View>

      <View className="px-3" style={{ flex: REQUEST_COLUMNS.registered, minWidth: 0 }}>
        <Text className="text-[13px]" numberOfLines={1} style={{ color: palette.heading }}>
          {formatDate(request.registeredAt)}
        </Text>
      </View>

      <View className="px-3" style={{ flex: REQUEST_COLUMNS.status, minWidth: 0 }}>
        <RequestStatusBadge status={request.verificationStatus} compact />
      </View>

      <View className="items-end justify-center px-3" style={{ width: REQUEST_COLUMNS.action }}>
        <Pressable
          onPress={onReview}
          accessibilityRole="button"
          accessibilityLabel={`Review the registration of ${resident.fullname}`}
          className="flex-row items-center gap-1.5 px-3 py-2 active:opacity-85"
          style={{ borderRadius: RADIUS.control, backgroundColor: palette.primary }}
        >
          <Feather name="shield" size={13} color="#FFFFFF" />
          <Text className="text-[12.5px] font-semibold text-white">Review</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RequestRow;
