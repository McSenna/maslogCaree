import { memo } from "react";
import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { SignupRequest } from "../../userAdmin.types";
import { formatDate } from "../../userDates";
import UserIdentity from "../ui/UserIdentity";
import UserStatusPill from "../ui/UserStatusPill";
import { CardSide } from "@/components/dashboard/kit/TableCard";

type PhoneRequestRowProps = {
  request: SignupRequest;
  first: boolean;
  onReview: (id: string, reject: boolean) => void;
};

/** Approve and Reject open the ID review first, as on wide layouts. */
const PhoneRequestRow = ({ request, first, onReview }: PhoneRequestRowProps) => {
  const palette = useAdminSurfacePalette();
  const meta = [request.location, `Submitted ${formatDate(request.submittedAt)}`].filter(Boolean).join(" · ");

  return (
    <View className="mx-4">
      <CardSide>
        <View className={`gap-3 px-1 py-3 ${first ? "" : "border-t border-divider"}`}>
          <UserIdentity large name={request.fullName} avatarUrl={request.avatarUrl} detail={request.email} />
          <View className="flex-row flex-wrap items-center gap-2 pl-[52px]">
            <UserStatusPill status={request.status} />
            <Text className="min-w-0 shrink text-[12px] font-medium text-text2">{meta}</Text>
          </View>
          <View className="flex-row gap-2">
            {request.status === "pending" ? (
              <>
                <View className="flex-1">
                  <DashboardButton palette={palette} size="md" fullWidth variant="primary" label="Approve" accessibilityLabel={`Approve ${request.fullName}`} onPress={() => onReview(request.id, false)} />
                </View>
                <View className="flex-1">
                  <DashboardButton palette={palette} size="md" fullWidth label="Reject" accessibilityLabel={`Reject ${request.fullName}`} onPress={() => onReview(request.id, true)} />
                </View>
              </>
            ) : (
              <View className="flex-1">
                <DashboardButton palette={palette} size="md" fullWidth icon="eye" label="Review" accessibilityLabel={`Review ${request.fullName}`} onPress={() => onReview(request.id, false)} />
              </View>
            )}
          </View>
        </View>
      </CardSide>
    </View>
  );
};

export default memo(PhoneRequestRow);
