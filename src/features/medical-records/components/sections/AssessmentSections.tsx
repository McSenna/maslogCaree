import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { FollowUp } from "@/components/medicalRecord/history/recordDetailGroups";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { MedicalRecord } from "@/services/medicalRecords";

import { formatDate } from "../recordFormat";
import DetailSection, { Paragraph } from "./DetailSection";

type Props = { palette: ResidentDialogPalette; record: MedicalRecord };

export const AssessmentSection = ({ palette, record }: Props) => {
  if (!record.assessment && !record.findings && !record.diagnosis) return null;

  return (
    <DetailSection
      palette={palette}
      title="Diagnosis & Findings"
      icon="check-square"
      iconColor="#059669"
    >
      <View style={{ gap: 12 }}>
        {record.diagnosis ? (
          <Paragraph palette={palette} label="Diagnosis" value={record.diagnosis} emphasis />
        ) : null}
        {record.assessment ? (
          <Paragraph palette={palette} label="Assessment" value={record.assessment} />
        ) : null}
        {record.findings ? (
          <Paragraph palette={palette} label="Findings" value={record.findings} />
        ) : null}
      </View>
    </DetailSection>
  );
};

export const RecommendationsSection = ({
  palette,
  record,
  followUp,
}: Props & { followUp: FollowUp | null }) => {
  const hasFollowUp = Boolean(followUp?.date || followUp?.instructions);
  if (!record.recommendations && !hasFollowUp) return null;

  return (
    <DetailSection
      palette={palette}
      title="Recommendations & Advice"
      icon="heart"
      iconColor={palette.warning}
    >
      <View style={{ gap: 10 }}>
        {record.recommendations ? (
          <Text style={{ fontSize: 14, color: palette.body, lineHeight: 20 }}>
            {record.recommendations}
          </Text>
        ) : null}

        {hasFollowUp ? (
          <View
            style={{
              marginTop: 4,
              padding: 12,
              borderRadius: 8,
              backgroundColor: palette.warningSoft,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Feather name="calendar" size={16} color={palette.warning} />
            <View style={{ minWidth: 0, flex: 1 }}>
              <Text style={{ fontSize: 12, color: palette.warningFg, fontWeight: "600" }}>
                Next Visit
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: palette.heading,
                  fontWeight: "500",
                  marginTop: 2,
                }}
              >
                {followUp?.date ? formatDate(followUp.date) : "To be advised"}
                {followUp?.instructions ? ` · ${followUp.instructions}` : ""}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </DetailSection>
  );
};
