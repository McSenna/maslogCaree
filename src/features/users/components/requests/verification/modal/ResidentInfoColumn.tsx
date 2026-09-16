import { Feather } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import type { UserRequestDetail } from "../../../../services/userRequestsService";
import InfoTile from "./InfoTile";
import VerificationStatusPill from "./VerificationStatusPill";

type Props = {
  resident?: UserRequestDetail["resident"];
  verification?: UserRequestDetail["verification"];
};

const longDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

const ResidentInfoColumn = ({ resident, verification }: Props) => {
  const { classes } = useTheme();

  const legalName =
    [resident?.firstName, resident?.middleName, resident?.surname, resident?.suffix]
      .filter(Boolean)
      .join(" ") || resident?.fullname;

  return (
    <View className="flex-1 gap-4">
      <View className="flex-row items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <View className="flex-row items-center gap-2">
          <Feather name="user" size={15} color="#2563EB" />
          <Text className="text-[14px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Resident Information
          </Text>
        </View>

        <VerificationStatusPill status={verification?.verificationStatus} />
      </View>

      <View className="flex-row items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
        {resident?.avatarUrl ? (
          <Image
            source={{ uri: resident.avatarUrl }}
            className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700"
          />
        ) : (
          <View className="w-14 h-14 rounded-full bg-blue-600 items-center justify-center">
            <Text className="text-white text-[18px] font-bold">
              {resident?.fullname?.charAt(0)?.toUpperCase() || "R"}
            </Text>
          </View>
        )}
        <View className="flex-1 min-w-0">
          <Text className={`text-[16px] font-extrabold ${classes.textPrimary}`} numberOfLines={1}>
            {resident?.fullname}
          </Text>
          <Text className={`text-[12px] ${classes.textMuted}`} numberOfLines={1}>
            {resident?.email}
          </Text>
          <Text className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mt-0.5">
            Role: Resident
          </Text>
        </View>
      </View>

      <View className="gap-2.5">
        <InfoTile label="Full Legal Name" value={legalName || "—"} size="md" />

        <View className="flex-row gap-2.5">
          <InfoTile
            label="Date of Birth"
            value={longDate(resident?.dateOfBirth)}
            className="flex-1"
          />
          <InfoTile
            label="Sex / Gender"
            value={resident?.gender || "—"}
            capitalize
            className="flex-1"
          />
        </View>

        <View className="flex-row gap-2.5">
          <InfoTile label="Contact Number" value={resident?.phone || "—"} className="flex-1" />
          <InfoTile
            label="Civil Status"
            value={resident?.civilStatus || "Single"}
            capitalize
            className="flex-1"
          />
        </View>

        <InfoTile label="Complete Address" value={resident?.address || "—"} />
        <InfoTile
          label="Submitted On"
          value={
            verification?.submittedAt ? new Date(verification.submittedAt).toLocaleString() : "—"
          }
        />

        {verification?.rejectionReason ? (
          <View className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
            <Text className="text-[11px] font-bold uppercase tracking-wider text-red-600">
              Rejection Reason
            </Text>
            <Text className="text-[13px] font-semibold text-red-700 dark:text-red-300 mt-0.5">
              {verification.rejectionReason}
            </Text>
            {verification.rejectionRemarks ? (
              <Text className="text-[12px] text-red-600 dark:text-red-400 mt-1">
                Remarks: {verification.rejectionRemarks}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default ResidentInfoColumn;
