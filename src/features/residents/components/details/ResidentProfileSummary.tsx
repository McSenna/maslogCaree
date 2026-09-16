import { Text, View } from "react-native";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import UserStatusBadge from "@/features/users/components/UserStatusBadge";
import { useUserDetailsPalette } from "@/features/users/components/details/detailsTheme";
import type { ResidentRecord } from "../../services/residentService";

const ResidentProfileSummary = ({ resident }: { resident: ResidentRecord }) => {
  const palette = useUserDetailsPalette();

  return (
    <View className="w-full items-center px-4 pb-1 pt-2">
      <View
        style={{
          borderRadius: 9999,
          borderWidth: 3,
          borderColor: palette.avatarRing,
          shadowColor: "#0F2557",
          shadowOpacity: 0.14,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        }}
      >
        <UserAvatar
          size={80}
          imageUrl={resident.profilePhoto}
          initials={initialsFrom(resident.fullname)}
          accessibilityLabel={`${resident.fullname} profile photo`}
          fallbackBackgroundColor={palette.primary}
        />
      </View>

      <Text
        className="mt-3 text-center text-[19px] font-bold"
        numberOfLines={2}
        style={{ color: palette.heading }}
      >
        {resident.fullname}
      </Text>
      <Text className="mt-0.5 text-center text-[13px]" style={{ color: palette.muted }}>
        {resident.reference}
      </Text>

      <View className="mt-3">
        <UserStatusBadge status={resident.status} />
      </View>
    </View>
  );
};

export default ResidentProfileSummary;
