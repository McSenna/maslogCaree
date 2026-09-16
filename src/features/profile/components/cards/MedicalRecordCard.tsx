import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { MedicalRecord } from "@/services/medicalRecords";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { PROFILE_RADIUS } from "../../config/profileTheme";
import {
  recordDate,
  recordFollowUp,
  recordProviderName,
  recordServiceLabel,
  recordSummary,
} from "../../utils/medicalRecordPresentation";

type MedicalRecordCardProps = {
  record: MedicalRecord;
};

const MedicalRecordCard = ({ record }: MedicalRecordCardProps) => {
  const title = recordServiceLabel(record);
  const provider = recordProviderName(record);
  const summary = recordSummary(record);
  const followUp = recordFollowUp(record);

  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${title}, ${recordDate(record)}`}
      style={{
        gap: 10,
        padding: 14,
        borderRadius: PROFILE_RADIUS.card,
        backgroundColor: SOCIAL_COLORS.surface,
        borderWidth: 1,
        borderColor: SOCIAL_COLORS.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 11 }}>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: SOCIAL_COLORS.greenSoft,
          }}
        >
          <Feather name="file-text" size={17} color={SOCIAL_COLORS.greenDeep} />
        </View>

        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
            style={{ fontSize: 15, fontWeight: "700", color: SOCIAL_COLORS.navy }}
          >
            {title}
          </Text>
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
            style={{ fontSize: 12.5, color: SOCIAL_COLORS.muted }}
          >
            {provider ? `${recordDate(record)} · ${provider}` : recordDate(record)}
          </Text>
        </View>
      </View>

      {summary ? (
        <Text
          numberOfLines={3}
          maxFontSizeMultiplier={1.2}
          style={{
            fontSize: 13.5,
            lineHeight: 19,
            color: SOCIAL_COLORS.body,
            borderTopWidth: 1,
            borderTopColor: SOCIAL_COLORS.divider,
            paddingTop: 10,
          }}
        >
          {summary}
        </Text>
      ) : null}

      {followUp ? (
        <Text style={{ fontSize: 12.5, fontWeight: "600", color: SOCIAL_COLORS.primary }}>
          {followUp}
        </Text>
      ) : null}
    </View>
  );
};

export default MedicalRecordCard;
