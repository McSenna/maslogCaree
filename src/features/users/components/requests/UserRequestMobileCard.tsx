import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import { formatDate } from "@/utils/dateFormatter";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "../usersTheme";
import type { UserRequestSummary } from "../../services/userRequestsService";

type UserRequestMobileCardProps = {
  request: UserRequestSummary;
  onReview: () => void;
  dense?: boolean;
};

const UserRequestMobileCard = ({
  request,
  onReview,
  dense = false,
}: UserRequestMobileCardProps) => {
  const palette = useUsersPalette();
  const resident = request.resident;
  const status = request.verificationStatus;

  const statusConfig = {
    pending: {
      label: "Pending",
      bg: "#FEF3C7",
      text: "#B45309",
      border: "#FCD34D",
    },
    approved: {
      label: "Approved",
      bg: "#DCFCE7",
      text: "#15803D",
      border: "#86EFAC",
    },
    rejected: {
      label: "Rejected",
      bg: "#FEE2E2",
      text: "#B91C1C",
      border: "#FCA5A5",
    },
  }[status] || {
    label: status,
    bg: "#F1F5F9",
    text: "#475569",
    border: "#CBD5E1",
  };

  return (
    <View
      className="w-full border p-3.5"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View className="flex-row items-start gap-3">
        <UserAvatar
          size={dense ? 48 : 54}
          imageUrl={resident.avatarUrl}
          initials={initialsFrom(resident.fullname || "Resident")}
          accessibilityLabel={`${resident.fullname} avatar`}
          fallbackBackgroundColor={palette.primary}
        />

        <View className="min-w-0 flex-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text
              className={dense ? "text-[15px] font-bold" : "text-[16px] font-bold"}
              numberOfLines={1}
              style={{ color: palette.heading }}
            >
              {resident.fullname}
            </Text>

            <View
              className="px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: statusConfig.bg,
                borderColor: statusConfig.border,
              }}
            >
              <Text
                className="text-[11px] font-bold"
                style={{ color: statusConfig.text }}
              >
                {statusConfig.label}
              </Text>
            </View>
          </View>

          <View className="mt-1 flex-row items-center gap-1.5">
            <Feather name="phone" size={12} color={palette.muted} />
            <Text className="text-[12px]" numberOfLines={1} style={{ color: palette.muted }}>
              {resident.phone || resident.email || "No contact"}
            </Text>
          </View>

          <View className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <Feather name="credit-card" size={12} color={palette.primary} />
                <Text
                  className="text-[12px] font-semibold"
                  numberOfLines={1}
                  style={{ color: palette.heading }}
                >
                  {request.idTypeName || request.idType}
                </Text>
              </View>
              <Text className="text-[11px] font-mono text-slate-500">
                {request.maskedIdNumber || "****"}
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <View className="flex-row items-center gap-1">
              <Feather name="calendar" size={11} color={palette.subtle} />
              <Text className="text-[11px]" style={{ color: palette.subtle }}>
                {formatDate(request.registeredAt)}
              </Text>
            </View>

            <Pressable
              onPress={onReview}
              accessibilityRole="button"
              accessibilityLabel={`Review ${resident.fullname}`}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg active:opacity-80"
              style={{ backgroundColor: palette.primary }}
            >
              <Feather name="shield" size={12} color="#fff" />
              <Text className="text-[12px] font-bold text-white">Review</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserRequestMobileCard;
