import { memo } from "react";
import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import DashboardRoleBadge from "@/components/dashboard/admin/DashboardRoleBadge";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { SignupRequest } from "../../userAdmin.types";
import { roleToApi } from "../../userAdminModel";
import { formatDate, formatTime } from "../../userDates";
import UserIdentity from "../ui/UserIdentity";
import { COLUMN, type TableMode } from "./tableColumns";
import { CardSide } from "@/components/dashboard/kit/TableCard";

type RequestTableRowProps = {
  request: SignupRequest;
  mode: TableMode;
  first: boolean;
  onReview: (id: string, reject: boolean) => void;
};

/**
 * A sign-up request. Approve and Reject open the ID review first (Reject
 * straight to the reasons), so no account is decided without seeing its ID.
 */
const RequestTableRow = ({ request, mode, first, onReview }: RequestTableRowProps) => {
  const palette = useAdminSurfacePalette();
  const showLocation = mode !== "tablet";
  const detail = showLocation || !request.location ? request.email : `${request.email} · ${request.location}`;

  return (
    <CardSide>
      <View className={`min-h-16 flex-row items-center gap-3 px-3 py-2.5 ${first ? "" : "border-t border-divider"}`}>
        <View className={COLUMN.user}>
          <UserIdentity name={request.fullName} avatarUrl={request.avatarUrl} detail={detail} />
        </View>
        <View className={`${COLUMN.requested} items-start`}>
          <DashboardRoleBadge role={roleToApi(request.role)} palette={palette} isDark={palette.isDark} />
        </View>
        {showLocation ? (
          <Text numberOfLines={2} className={`${COLUMN.location} text-[13px] leading-[18px] text-body`}>
            {request.location || "Not recorded"}
          </Text>
        ) : null}
        <View className={COLUMN.submitted}>
          <Text className="text-[13px] text-body">{formatDate(request.submittedAt)}</Text>
          <Text className="text-[12px] text-text2">{formatTime(request.submittedAt)}</Text>
        </View>
        {request.status === "pending" ? (
          <View className={`${COLUMN.decide} flex-row justify-end gap-2`}>
            <DashboardButton palette={palette} label="Reject" accessibilityLabel={`Reject ${request.fullName}`} onPress={() => onReview(request.id, true)} />
            <DashboardButton palette={palette} variant="primary" label="Approve" accessibilityLabel={`Approve ${request.fullName}`} onPress={() => onReview(request.id, false)} />
          </View>
        ) : (
          <View className={COLUMN.review}>
            {/* NOTE: the API only decides pending requests, so a rejected one can be reviewed, not approved. */}
            <DashboardButton palette={palette} label="Review" icon="eye" accessibilityLabel={`Review ${request.fullName}`} onPress={() => onReview(request.id, false)} />
          </View>
        )}
      </View>
    </CardSide>
  );
};

export default memo(RequestTableRow);
