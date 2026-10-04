import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { MedicalRecord } from "@/services/medicalRecords";

import { isEncodedRecord } from "@/services/medicalRecordTypes";

import { formatDate, formatDateTime } from "../recordFormat";
import { PALETTE, withAlpha } from "@/theme/palette";

type Props = {
  palette: ResidentDialogPalette;
  record: MedicalRecord;
  serviceLabel: string;
};

const providerOf = (record: MedicalRecord) => {
  const provider = record.provider;
  if (provider && typeof provider === "object") {
    return { name: provider.fullname ?? "", role: provider.role ?? record.providerRole ?? "" };
  }
  return { name: record.providerName ?? "", role: record.providerRole ?? "" };
};

export const MedicalRecordSummary = ({ palette, record, serviceLabel }: Props) => {
  const provider = providerOf(record);
  // A paper record has a visit day but no time.
  const historical = isEncodedRecord(record);

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 14,
        backgroundColor: palette.accentSoft,
        borderColor: palette.accentBorder,
        borderWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <View style={{ minWidth: 0, flex: 1 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: palette.accent,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Medical Record
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700", color: palette.heading, marginTop: 2 }}>
            {serviceLabel}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor: palette.successSoft,
            borderColor: palette.successBorder,
            borderWidth: 1,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600", color: palette.successFg }}>
            {historical ? "Historical record" : "Completed"}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: palette.isDark ? withAlpha(PALETTE.white, 0.08) : withAlpha(PALETTE.ink, 0.06),
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {provider.name ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Feather name="user-check" size={14} color={palette.accent} />
            <Text style={{ fontSize: 13, color: palette.body, fontWeight: "500" }}>
              {provider.name}
              {provider.role ? ` (${provider.role})` : ""}
            </Text>
          </View>
        ) : null}

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Feather name="calendar" size={14} color={palette.muted} />
          <Text style={{ fontSize: 13, color: palette.muted }}>
            {historical ? formatDate(record.completedAt) : formatDateTime(record.completedAt ?? record.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MedicalRecordSummary;
