import { Text, View } from "react-native";

import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";

import { useUserDetailsPalette } from "../../../details/detailsTheme";
import RequestStatusBadge from "../../RequestStatusBadge";
import type { UserRequestDetail } from "../../../../services/userRequestsService";

type Props = {
  resident?: UserRequestDetail["resident"];
  verification?: UserRequestDetail["verification"];
  registeredLabel: string;
};

const VerificationResidentHeader = ({
  resident,
  verification,
  registeredLabel,
}: Props) => {
  const palette = useUserDetailsPalette();

  return (
    <View className="w-full flex-row items-center gap-3 px-4">
      <UserAvatar
        size={56}
        imageUrl={resident?.avatarUrl}
        initials={initialsFrom(resident?.fullname)}
        accessibilityLabel={`${resident?.fullname ?? "Resident"} avatar`}
        fallbackBackgroundColor={palette.primary}
      />
      <View className="min-w-0 flex-1 gap-1">
        <Text
          className="text-[16px] font-bold"
          numberOfLines={1}
          style={{ color: palette.heading }}
        >
          {resident?.fullname || "Resident"}
        </Text>
        <Text className="text-[12.5px]" numberOfLines={1} style={{ color: palette.muted }}>
          Registered {registeredLabel}
        </Text>
        {verification ? (
          <RequestStatusBadge status={verification.verificationStatus} compact />
        ) : null}
      </View>
    </View>
  );
};

export default VerificationResidentHeader;
